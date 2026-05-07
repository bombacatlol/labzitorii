// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title OnlinePoll - простой онлайн-опрос с одним голосом от адреса
contract OnlinePoll {
    // Вопрос опроса
    string public question;

    // Варианты ответов (храним в storage)
    string[] private options;

    // Кол-во голосов за каждый вариант: index варианта -> кол-во голосов
    mapping(uint256 => uint256) public votes;

    // Проголосовал ли уже адрес
    mapping(address => bool) public hasVoted;

    // Владелец (кто задеплоил контракт)
    address public owner;

    // Событие голосования
    event Voted(address indexed voter, uint256 indexed optionIndex);

    /// @notice Конструктор: задаём вопрос и варианты
    /// @param _question текст вопроса
    /// @param _options список вариантов (минимум 2)
    constructor(string memory _question, string[] memory _options) {
        require(bytes(_question).length > 0, "Empty question");
        require(_options.length >= 2, "Need at least 2 options");

        question = _question;
        owner = msg.sender;

        // Копируем варианты в storage
        for (uint256 i = 0; i < _options.length; i++) {
            require(bytes(_options[i]).length > 0, "Empty option");
            options.push(_options[i]);
        }
    }

    /// @notice Проголосовать за вариант
    /// @param optionIndex индекс варианта (0..options.length-1)
    function vote(uint256 optionIndex) external {
        require(optionIndex < options.length, "Invalid option");
        require(!hasVoted[msg.sender], "Already voted");

        hasVoted[msg.sender] = true;
        votes[optionIndex] += 1;

        emit Voted(msg.sender, optionIndex);
    }

    /// @notice Получить все варианты
    function getOptions() external view returns (string[] memory) {
        return options;
    }

    /// @notice Количество вариантов
    function getOptionsCount() external view returns (uint256) {
        return options.length;
    }

    /// @notice Общее количество голосов по всем вариантам
    function getTotalVotes() external view returns (uint256 total) {
        for (uint256 i = 0; i < options.length; i++) {
            total += votes[i];
        }
    }
}
