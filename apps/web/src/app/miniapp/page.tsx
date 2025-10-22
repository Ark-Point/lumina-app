// "use client";

// import { sdk } from "@farcaster/miniapp-sdk";
// import { useEffect } from "react";

// export default function MiniAppHome() {
//   useEffect(() => {
//     const boot = async () => {
//       // TODO: 필요한 초기 데이터 로딩 등
//       await sdk.actions.ready(); // 스플래시 제거 (필수)
//     };
//     boot();
//   }, []);

//   const tryHaptics = async () => {
//     // 방법 A: capabilities로 안전하게 체크
//     const caps = await sdk.getCapabilities();
//     if (caps.includes("haptics.impactOccurred")) {
//       await sdk.haptics.impactOccurred("heavy"); // 'light' | 'medium' | 'heavy' | 'soft' | 'rigid'
//     }
//     // 방법 B: context.features로 가벼운 게이트
//     // if (sdk.context.features?.haptics) await sdk.haptics.selectionChanged();
//   };

//   const tryOpenUrl = async () => {
//     await sdk.actions.openUrl(
//       "https://uncuttable-izola-sinuous.ngrok-free.dev/"
//     );
//   };

//   return (
//     <main className="p-6">
//       <h1 className="text-2xl font-semibold">Sample Mini App</h1>
//       <p className="mt-2">
//         여기에 UI를 구현하면 Warpcast/Base 앱 안에서 그대로 뜹니다.
//       </p>
//       {/* 예시: 간단한 액션 */}
//       <button className="mt-4 rounded-md border px-4 py-2" onClick={tryHaptics}>
//         진동 테스트
//       </button>
//       <button className="mt-4 rounded-md border px-4 py-2" onClick={tryOpenUrl}>
//         openUrl 테스트
//       </button>
//     </main>
//   );
// }
import {
  APP_DESCRIPTION,
  APP_NAME,
  APP_OG_IMAGE_URL,
} from "@/app/miniapp/constant/mini-app";
import { getMiniAppEmbedMetadata } from "@/app/miniapp/lib/utils";
import { Metadata } from "next";
import App from "./app";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: APP_NAME,
    openGraph: {
      title: APP_NAME,
      description: APP_DESCRIPTION,
      images: [APP_OG_IMAGE_URL],
    },
    other: {
      "fc:frame": JSON.stringify(getMiniAppEmbedMetadata()),
    },
  };
}

export default function Home() {
  return <App />;
}
