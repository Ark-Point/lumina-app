"use client";

import { APP_NAME } from "@/app/miniapp/constant/mini-app";
import sdk from "@farcaster/miniapp-sdk";
import { useMiniApp } from "@neynar/react";
import { useState } from "react";

import {
  AvatarButton,
  AvatarImage,
  DropdownContainer,
  DropdownContent,
  DropdownMeta,
  DropdownNameButton,
  HeaderCard,
  HeaderContainer,
  HeaderTitle,
} from "./components/Header";

type HeaderProps = {
  neynarUser?: {
    fid: number;
    score: number;
  } | null;
};

export function Header({ neynarUser }: HeaderProps) {
  const { context } = useMiniApp();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  return (
    <HeaderContainer>
      <HeaderCard>
        <HeaderTitle>Welcome to {APP_NAME}!</HeaderTitle>
        {context?.user && (
          <AvatarButton
            onClick={() => {
              setIsUserDropdownOpen(!isUserDropdownOpen);
            }}
          >
            {context.user.pfpUrl && (
              <AvatarImage
                src={context.user.pfpUrl}
                alt="Profile"
              />
            )}
          </AvatarButton>
        )}
      </HeaderCard>
      {context?.user && (
        <>
          {isUserDropdownOpen && (
            <DropdownContainer>
              <DropdownContent>
                <div>
                  <DropdownNameButton
                    onClick={() =>
                      sdk.actions.viewProfile({ fid: context.user.fid })
                    }
                  >
                    {context.user.displayName || context.user.username}
                  </DropdownNameButton>
                  <DropdownMeta>@{context.user.username}</DropdownMeta>
                  <DropdownMeta>FID: {context.user.fid}</DropdownMeta>
                  {neynarUser && (
                    <>
                      <DropdownMeta>
                        Neynar Score: {neynarUser.score}
                      </DropdownMeta>
                    </>
                  )}
                </div>
              </DropdownContent>
            </DropdownContainer>
          )}
        </>
      )}
    </HeaderContainer>
  );
}
