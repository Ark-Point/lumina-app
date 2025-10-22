import { Tab } from "@/app/miniapp/components/App";
import React from "react";

import {
  FooterButton,
  FooterNav,
  FooterWrapper,
} from "./components/Footer";

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
        isActive={activeTab === Tab.Home}
        onClick={() => setActiveTab(Tab.Home)}
      >
        <span>🏠</span>
        <span>Home</span>
      </FooterButton>
      <FooterButton
        type="button"
        isActive={activeTab === Tab.Actions}
        onClick={() => setActiveTab(Tab.Actions)}
      >
        <span>⚡</span>
        <span>Actions</span>
      </FooterButton>
      <FooterButton
        type="button"
        isActive={activeTab === Tab.Context}
        onClick={() => setActiveTab(Tab.Context)}
      >
        <span>📋</span>
        <span>Context</span>
      </FooterButton>
      {showWallet && (
        <FooterButton
          type="button"
          isActive={activeTab === Tab.Wallet}
          onClick={() => setActiveTab(Tab.Wallet)}
        >
          <span>👛</span>
          <span>Wallet</span>
        </FooterButton>
      )}
    </FooterNav>
  </FooterWrapper>
);
