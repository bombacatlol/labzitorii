import { expect } from "chai";
import { ethers } from "hardhat";

describe("TodoList", function () {
  async function deployTodoList() {
    const TodoList = await ethers.getContractFactory("TodoList");
    const todoList = await TodoList.deploy();
    await todoList.waitForDeployment();
    return todoList;
  }

  it("Should add a new task", async function () {
    const todoList = await deployTodoList();

    await todoList.addTask("Сделать итоговый проект");

    const count = await todoList.getTasksCount();
    expect(count).to.equal(1);

    const task = await todoList.getTask(0);
    expect(task[0]).to.equal("Сделать итоговый проект");
    expect(task[1]).to.equal(false);
  });

  it("Should emit TaskAdded event", async function () {
    const todoList = await deployTodoList();

    await expect(todoList.addTask("Новая задача")).to.emit(todoList, "TaskAdded").withArgs(0, "Новая задача");
  });

  it("Should complete a task", async function () {
    const todoList = await deployTodoList();

    await todoList.addTask("Закрыть задачу");
    await todoList.completeTask(0);

    const task = await todoList.getTask(0);
    expect(task[1]).to.equal(true);
  });

  it("Should revert when adding empty task", async function () {
    const todoList = await deployTodoList();

    await expect(todoList.addTask("")).to.be.revertedWith("Empty task");
  });

  it("Should revert when completing already completed task", async function () {
    const todoList = await deployTodoList();

    await todoList.addTask("Повторно не закрывать");
    await todoList.completeTask(0);

    await expect(todoList.completeTask(0)).to.be.revertedWith("Task already completed");
  });
});
