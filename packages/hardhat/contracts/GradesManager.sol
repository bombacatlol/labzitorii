// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

/// @title GradesManager — простая система управления оценками студентов
/// @notice Контракт позволяет преподавателю выставлять и просматривать оценки студентов
contract GradesManager {
    address public teacher;                     // владелец/преподаватель
    mapping(address => uint8) private grades;   // оценки 0..100

    event GradeSet(address indexed by, address indexed student, uint8 grade); // событие выставления оценки

    /// @dev Ограничивает вызов функции только преподавателем
    modifier onlyTeacher() {
        require(msg.sender == teacher, "Only teacher");
        _;
    }

    /// @notice Устанавливает преподавателя при деплое контракта
    constructor() {
        teacher = msg.sender;
    }

    /// @notice Получить свою оценку (read-only)
    function getMyGrade() external view returns (uint8) {
        return grades[msg.sender];
    }

    /// @notice Получить оценку любого студента (для интерфейса преподавателя)
    function getGrade(address student) external view returns (uint8) {
        return grades[student];
    }

    /// @notice Выставить или обновить оценку студенту (только преподаватель)
    /// @param student адрес студента
    /// @param grade оценка от 0 до 100
    function setGrade(address student, uint8 grade) external onlyTeacher {
        require(student != address(0), "Bad student");
        require(grade <= 100, "Grade out of range");
        grades[student] = grade;
        emit GradeSet(msg.sender, student, grade);
    }
}
