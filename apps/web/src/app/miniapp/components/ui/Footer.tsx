import { Tab } from "@/app/miniapp/components/App";
import Image from "next/image";
import React from "react";

import ChatIcon from "@/app/miniapp/asset/tabs/chat.svg";
import RankingIcon from "@/app/miniapp/asset/tabs/ranking.svg";
import UserIcon from "@/app/miniapp/asset/tabs/user.svg";
import { FooterButton, FooterNav, FooterWrapper } from "./components/Footer";

interface FooterProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  showWallet?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  activeTab,
  setActiveTab,
  showWallet = false,
}) => (
  <FooterWrapper>
    <FooterNav>
      <FooterButton
        type="button"
        isActive={activeTab === Tab.Chat}
        onClick={() => setActiveTab(Tab.Chat)}
      >
        <span aria-hidden="true">
          <Image src={ChatIcon} alt="" width={24} height={24} />
        </span>
      </FooterButton>
      <FooterButton
        type="button"
        isActive={false}
        disabled={true}
        onClick={() => {
          alert("Not Available yet ...");
        }}
      >
        <span aria-hidden="true">
          <Image src={RankingIcon} alt="" width={24} height={24} />
        </span>
      </FooterButton>
      {/* <FooterButton
        type="button"
        isActive={activeTab === Tab.Context}
        onClick={() => setActiveTab(Tab.Context)}
      >
        <span>📋</span>
        <span>Context</span>
      </FooterButton> */}
      {showWallet && (
        <FooterButton
          type="button"
          isActive={activeTab === Tab.Account}
          onClick={() => setActiveTab(Tab.Account)}
        >
          <span aria-hidden="true">
            <Image src={UserIcon} alt="" width={24} height={24} />
          </span>
        </FooterButton>
      )}
    </FooterNav>
  </FooterWrapper>
);
