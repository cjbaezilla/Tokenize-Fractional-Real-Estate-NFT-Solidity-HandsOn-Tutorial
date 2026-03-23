import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MockUSDTModule = buildModule("MockUSDTModule", (m) => {
  // Deployment parameters with defaults
  const initialOwner = m.getParameter("initialOwner", "0xaEeaA55ED4f7df9E4C5688011cEd1E2A1b696772");

  // Deploy the MockUSDT contract
  const mockUSDT = m.contract("MockUSDT", [initialOwner]);

  return { mockUSDT };
});

export default MockUSDTModule;
