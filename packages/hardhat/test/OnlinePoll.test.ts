import { expect } from "chai";
import { ethers } from "hardhat";

describe("OnlinePoll", function () {
  async function deployFixture() {
    const [owner, voter, other] = await ethers.getSigners();

    const question = "Любимый фреймворк для блокчейна?";
    const options = ["Hardhat", "Foundry", "Remix"];

    const Poll = await ethers.getContractFactory("OnlinePoll");
    const poll = await Poll.deploy(question, options);
    await poll.waitForDeployment();

    return { poll, owner, voter, other, question, options };
  }

  it("stores question and options", async function () {
    const { poll, question, options } = await deployFixture();

    expect(await poll.question()).to.equal(question);

    const storedOptions = await poll.getOptions();
    expect(storedOptions.length).to.equal(options.length);
    expect(storedOptions[0]).to.equal(options[0]);
  });

  it("allows voting and increments counter", async function () {
    const { poll, voter } = await deployFixture();

    await poll.connect(voter).vote(1);

    const votesForOption1 = await poll.votes(1);
    expect(votesForOption1).to.equal(1);

    const hasVoted = await poll.hasVoted(voter.address);
    expect(hasVoted).to.equal(true);
  });

  it("emits Voted event", async function () {
    const { poll, voter } = await deployFixture();

    await expect(poll.connect(voter).vote(0)).to.emit(poll, "Voted").withArgs(voter.address, 0);
  });

  it("reverts on double vote", async function () {
    const { poll, voter } = await deployFixture();

    await poll.connect(voter).vote(2);

    await expect(poll.connect(voter).vote(1)).to.be.revertedWith("Already voted");
  });

  it("reverts on invalid option index", async function () {
    const { poll, voter } = await deployFixture();

    await expect(poll.connect(voter).vote(999)).to.be.revertedWith("Invalid option");
  });
});
