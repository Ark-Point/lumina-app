import "@lumina-app/config";
import { ChildProcess, spawn } from "child_process";
import localtunnel from "localtunnel";
import { createServer } from "net";
import { createRequire } from "node:module";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(path.normalize(path.join(__dirname, "..")));

let tunnel: localtunnel.Tunnel;
let nextDev: ChildProcess;
let isCleaningUp = false;

// Parse command line arguments for port
const args = process.argv.slice(2);
let port = process.env.WEB_PORT! as unknown as number; // default port

if (!port) {
  throw new Error("Required Port value");
}

// Look for --port=XXXX, --port XXXX, -p=XXXX, or -p XXXX
args.forEach((arg, index) => {
  if (arg.startsWith("--port=")) {
    port = parseInt(arg.split("=")[1]);
  } else if (arg === "--port" && args[index + 1]) {
    port = parseInt(args[index + 1]);
  } else if (arg.startsWith("-p=")) {
    port = parseInt(arg.split("=")[1]);
  } else if (arg === "-p" && args[index + 1]) {
    port = parseInt(args[index + 1]);
  }
});

async function checkPort(port: number) {
  return new Promise((resolve) => {
    const server = createServer();

    server.once("error", () => {
      resolve(true); // Port is in use
    });

    server.once("listening", () => {
      server.close();
      resolve(false); // Port is free
    });

    server.listen(port);
  });
}

async function killProcessOnPort(port: number) {
  try {
    if (process.platform === "win32") {
      // Windows: Use netstat to find the process
      const netstat = spawn("netstat", ["-ano", "|", "findstr", `:${port}`]);
      netstat.stdout.on("data", (data) => {
        const match = data.toString().match(/\s+(\d+)$/);
        if (match) {
          const pid = match[1];
          spawn("taskkill", ["/F", "/PID", pid]);
        }
      });
      await new Promise((resolve) => netstat.on("close", resolve));
    } else {
      // Unix-like systems: Use lsof
      const lsof = spawn("lsof", ["-ti", `:${port}`]);
      lsof.stdout.on("data", (data) => {
        data
          .toString()
          .split("\n")
          .forEach((pid: string) => {
            if (pid) {
              try {
                process.kill(parseInt(pid), "SIGKILL");
              } catch (e: any) {
                if (e.code !== "ESRCH") throw e;
              }
            }
          });
      });
      await new Promise((resolve) => lsof.on("close", resolve));
    }
  } catch (e) {
    // Ignore errors if no process found
  }
}

function resolveNextBin(rootDir: string) {
  try {
    // apps/web 같은 실제 앱 루트 기준으로 우선 탐색
    return require.resolve("next/dist/bin/next", { paths: [rootDir] });
  } catch {
    // 루트 호이스팅 등 다른 위치에 있을 수 있으니 한 번 더 시도
    return require.resolve("next/dist/bin/next");
  }
}

function resolveNextEntry(rootDir: string) {
  // rootDir(예: apps/web)을 기준으로 모듈 해석할 require를 생성
  const requireFromApp = createRequire(path.join(rootDir, "package.json"));
  try {
    // 워크스페이스/호이스팅 상관없이 앱 기준으로 next 엔트리 해석
    return requireFromApp.resolve("next/dist/bin/next");
  } catch (e1) {
    // 혹시 실패하면 현재 모듈 기준으로도 한 번 더 시도
    const requireHere = createRequire(import.meta.url);
    try {
      return requireHere.resolve("next/dist/bin/next");
    } catch (e2) {
      throw new Error(
        `Cannot resolve next entry.\nTried:\n- from app: ${rootDir}\n- from here: ${import.meta.url}\nOriginal errors:\n${e1}\n${e2}`
      );
    }
  }
}

async function startDev() {
  // Check if the specified port is already in use
  const isPortInUse = await checkPort(port);
  if (isPortInUse) {
    console.error(
      `Port ${port} is already in use. To find and kill the process using this port:\n\n` +
        (process.platform === "win32"
          ? `1. Run: netstat -ano | findstr :${port}\n` +
            "2. Note the PID (Process ID) from the output\n" +
            "3. Run: taskkill /PID <PID> /F\n"
          : `On macOS/Linux, run:\nnpm run cleanup\n`) +
        "\nThen try running this command again."
    );
    process.exit(1);
  }

  const useTunnel = process.env.USE_TUNNEL === "true";
  let miniAppUrl;

  if (useTunnel) {
    // Start localtunnel and get URL
    tunnel = await localtunnel({ port: port });
    let ip;
    try {
      ip = await fetch("https://ipv4.icanhazip.com")
        .then((res) => res.text())
        .then((ip) => ip.trim());
    } catch (error) {
      console.error("Error getting IP address:", error);
    }

    miniAppUrl = tunnel.url + "/miniapp";
    console.log(`
🌐 Local tunnel URL: ${tunnel.url}

💻 To test on desktop:
   1. Open the localtunnel URL in your browser: ${tunnel.url}
   2. Enter your IP address in the password field${ip ? `: ${ip}` : ""} (note that this IP may be incorrect if you are using a VPN)
   3. Click "Click to Submit" -- your mini app should now load in the browser
   4. Navigate to the Warpcast Mini App Developer Tools: https://warpcast.com/~/developers
   5. Enter your mini app URL: ${tunnel.url}
   6. Click "Preview" to launch your mini app within Warpcast (note that it may take ~10 seconds to load)


❗️ You will not be able to load your mini app in Warpcast until    ❗️
❗️ you submit your IP address in the localtunnel password field ❗️


📱 To test in Warpcast mobile app:
   1. Open Warpcast on your phone
   2. Go to Settings > Developer > Mini Apps
   4. Enter this URL: ${tunnel.url}
   5. Click "Preview" (note that it may take ~10 seconds to load)
`);
  } else {
    miniAppUrl = `http://localhost:${port}/miniapp`;
    console.log(`
💻 To test your mini app:
   1. Open the Warpcast Mini App Developer Tools: https://warpcast.com/~/developers
   2. Scroll down to the "Preview Mini App" tool
   3. Enter this URL: ${miniAppUrl}
   4. Click "Preview" to test your mini app (note that it may take ~5 seconds to load the first time)
`);
  }

  // // Start next dev with appropriate configuration
  // const nextBin = path.normalize(
  //   path.join(projectRoot, "node_modules", ".bin", "next")
  // );
  const nextEntry = resolveNextEntry(projectRoot);

  console.log("******* nextEntry: ", nextEntry);
  nextDev = spawn(process.execPath, [nextEntry, "dev", "-p", port.toString()], {
    cwd: projectRoot,
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_PUBLIC_MINI_APP_URL: miniAppUrl,
      MINI_APP_NEXTAUTH_URL: miniAppUrl,
    },
    shell: process.platform === "win32", // Add shell option for Windows
  });

  // Handle cleanup
  const cleanup = async () => {
    if (isCleaningUp) return;
    isCleaningUp = true;

    console.log("\n\nShutting down...");

    try {
      if (nextDev) {
        try {
          // Kill the main process first
          nextDev.kill("SIGKILL");
          // Then kill any remaining child processes in the group
          if (nextDev?.pid) {
            try {
              process.kill(-nextDev.pid);
            } catch (e: any) {
              // Ignore ESRCH errors when killing process group
              if (e.code !== "ESRCH") throw e;
            }
          }
          console.log("🛑 Next.js dev server stopped");
        } catch (e) {
          // Ignore errors when killing nextDev
          console.log("Note: Next.js process already terminated");
        }
      }

      if (tunnel) {
        try {
          await tunnel.close();
          console.log("🌐 Tunnel closed");
        } catch (e) {
          console.log("Note: Tunnel already closed");
        }
      }

      // Force kill any remaining processes on the specified port
      await killProcessOnPort(port);
    } catch (error) {
      console.error("Error during cleanup:", error);
    } finally {
      process.exit(0);
    }
  };

  // Handle process termination
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("exit", cleanup);
  if (tunnel) {
    tunnel.on("close", cleanup);
  }
}

startDev().catch(console.error);
