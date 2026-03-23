import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MockUSDTModule = buildModule("MockUSDTModule", (m) => {
  // Deployment parameters with defaults
  const initialOwner = m.getParameter("initialOwner", m.env().get("DEPLOYER_ADDRESS") || "0x0000000000000000000000000000000000000000");

  // Deploy the MockUSDT contract
  const mockUSDT = m.contract("MockUSDT", [initialOwner]);

  return { mockUSDT };
});

export default MockUSDTModule;
