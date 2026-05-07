// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract TodoList {
    struct Task {
        string text;
        bool completed;
    }

    Task[] private tasks;
    address public owner;

    event TaskAdded(uint256 indexed taskIndex, string text);
    event TaskCompleted(uint256 indexed taskIndex);

    constructor() {
        owner = msg.sender;
    }

    function addTask(string memory _text) external {
        require(bytes(_text).length > 0, "Empty task");

        tasks.push(Task({
            text: _text,
            completed: false
        }));

        emit TaskAdded(tasks.length - 1, _text);
    }

    function completeTask(uint256 taskIndex) external {
        require(taskIndex < tasks.length, "Invalid task index");
        require(!tasks[taskIndex].completed, "Task already completed");

        tasks[taskIndex].completed = true;

        emit TaskCompleted(taskIndex);
    }

    function getTask(uint256 taskIndex) external view returns (string memory text, bool completed) {
        require(taskIndex < tasks.length, "Invalid task index");
        Task memory task = tasks[taskIndex];
        return (task.text, task.completed);
    }

    function getTasksCount() external view returns (uint256) {
        return tasks.length;
    }
}