pragma solidity ^0.4.22;


// Factory "Class" - elections are instanciated from this contract
contract ElectionFactory {
    address[] public deployedElections;
    mapping(address => bool) public admins;
    address public superAdmin = 0x3e5c4a740117e070DfE112DF39BBeC6B9BA43b13;

    modifier restricted() {
        require(msg.sender == superAdmin || admins[msg.sender] == true);
        _;
    }

    function createElection(string memory _title, string memory _desc)
        public
        restricted
    {
        Election newElection = new Election(_title, _desc, msg.sender);
        deployedElections.push(address(newElection));
    }

    function getDeployedElections() public view returns (address[] memory) {
        return deployedElections;
    }

    function getDeployedElectionsLength() public view returns (uint256) {
        return deployedElections.length;
    }

    function addAdmin(address _address) public restricted {
        admins[_address] = true;
    }
}


contract Election {
    ////////////////////// VARIABLES //////////////////////
    // Election Title
    string public title;

    // Election text description
    string public description;

    // Manager of the election
    mapping(address => bool) public managers;

    // enabled voting stations
    mapping(address => bool) public votingStations;

    // enabled
    bool public enabled;

    // finalized
    bool public finalized;

    // struct containing details of all voting options
    struct VoteOption {
        uint256 ID;
        string option;
        bool enabled;
    }

    VoteOption[] public VoteOptions;

    // struct containing a vote details
    struct Vote {
        string selectedOption;
    }

    Vote[] public Votes;

    ////////////////////// MODIFIERS //////////////////////
    modifier restrictAdmin() {
        require(managers[msg.sender] == true);
        require(enabled == false);
        _;
    }

    modifier restrictFinalize() {
        require(managers[msg.sender] == true);
        require(enabled == true);
        _;
    }

    modifier rescrictVote() {
        // check voting stations & if enabled
        require(votingStations[msg.sender] == true);
        require(enabled == true);
        _;
    }

    ////////////////////// CONSTRUCTOR //////////////////////
    function Election(
        string memory _title,
        string memory _desc,
        address creator
    ) public {
        title = _title;
        description = _desc;
        managers[creator] = true;
        enabled = false;
    }

    ////////////////////// SETTERS //////////////////////
    function addVotingOption(string memory _option) public restrictAdmin {
        VoteOption memory newVoteOption = VoteOption({
            ID: VoteOptions.length,
            option: _option,
            enabled: true
        });

        VoteOptions.push(newVoteOption);
    }

    function castVote(string _selectedOption) public rescrictVote {
        // add vote to arrays of votes
        Vote memory newVote = Vote({selectedOption: _selectedOption});

        Votes.push(newVote);
    }

    function addVotingStation(address _address) public restrictAdmin {
        votingStations[_address] = true;
    }

    function removeVotingStation(address _address) public restrictAdmin {
        votingStations[_address] = false;
    }

    function addManager(address _address) public restrictAdmin {
        managers[_address] = true;
    }

    function removeManager(address _address) public restrictAdmin {
        managers[_address] = false;
    }

    function disableVotingOption(uint256 _optionID) public restrictAdmin {
        VoteOptions[_optionID].enabled = false;
    }

    function enableVotingOption(uint256 _optionID) public restrictAdmin {
        VoteOptions[_optionID].enabled = true;
    }

    function enableElection() public restrictAdmin {
        require(VoteOptions.length > 0);
        enabled = true;
    }

    function finalizeElection() public restrictFinalize {
        finalized = true;
    }

    ////////////////////// GETTERS //////////////////////
    function getVoteOptionsLength() public view returns (uint256) {
        return VoteOptions.length;
    }

    function getVotesLength() public view returns (uint256) {
        return Votes.length;
    }
}
