// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

contract FileShare {
    struct FileToken {
        address primaryOwner;
        mapping(address => bool) temporaryOwners;
        string filename;
        uint filesize;
        uint timestamp;
    }

    mapping(string => FileToken) fileTokens;
    mapping(address => string[]) ownerFiles;
    mapping(address => string[]) sharedFiles;
    mapping(string => address[]) sharedWith; // Mapping to track shared addresses for each file

    function uploadfile(string memory _url, string memory _filename, uint _filesize) external {
        require(bytes(_url).length > 0, "File URL cannot be empty.");
        require(bytes(_filename).length > 0, "Filename cannot be empty.");
        require(_filesize > 0, "File size must be greater than 0.");


        fileTokens[_url].primaryOwner = msg.sender;
        fileTokens[_url].filename = _filename;
        fileTokens[_url].filesize = _filesize;
        fileTokens[_url].timestamp = block.timestamp;

        ownerFiles[msg.sender].push(_url);
    }

    function grantAccess(string memory _url, address _temporaryOwner) external {
        require(msg.sender == fileTokens[_url].primaryOwner, "Only the primary owner can grant access.");
        require(fileTokens[_url].primaryOwner != address(0), "File does not exist.");
        if (fileTokens[_url].temporaryOwners[_temporaryOwner]) {
            revert("Access has already been granted.");
        }
        fileTokens[_url].temporaryOwners[_temporaryOwner] = true;
        sharedFiles[_temporaryOwner].push(_url);
        sharedWith[_url].push(_temporaryOwner); // Track the shared address
    }

    function revokeAccess(string memory _url, address _temporaryOwner) external {
        require(msg.sender == fileTokens[_url].primaryOwner, "Only the primary owner can revoke access.");
        require(fileTokens[_url].primaryOwner != address(0), "File does not exist.");
        if (!fileTokens[_url].temporaryOwners[_temporaryOwner]) {
            revert("Access has not been granted.");
        }
        fileTokens[_url].temporaryOwners[_temporaryOwner] = false;
        for (uint i = 0; i < sharedFiles[_temporaryOwner].length; i++) {
            if (keccak256(abi.encodePacked(sharedFiles[_temporaryOwner][i])) == keccak256(abi.encodePacked(_url))) {
                sharedFiles[_temporaryOwner][i] = sharedFiles[_temporaryOwner][sharedFiles[_temporaryOwner].length - 1];
                sharedFiles[_temporaryOwner].pop();
                break;
            }
        }
        // Remove the temporary owner from the sharedWith mapping
        for (uint i = 0; i < sharedWith[_url].length; i++) {
            if (sharedWith[_url][i] == _temporaryOwner) {
                sharedWith[_url][i] = sharedWith[_url][sharedWith[_url].length - 1];
                sharedWith[_url].pop();
                break;
            }
        }
    }

    function deleteFile(string memory _url) external {
        require(msg.sender == fileTokens[_url].primaryOwner, "Only the primary owner can delete the file.");
        require(fileTokens[_url].primaryOwner != address(0), "File does not exist.");

        for (uint i = 0; i < ownerFiles[msg.sender].length; i++) {
            if (keccak256(abi.encodePacked(ownerFiles[msg.sender][i])) == keccak256(abi.encodePacked(_url))) {
                ownerFiles[msg.sender][i] = ownerFiles[msg.sender][ownerFiles[msg.sender].length - 1];
                ownerFiles[msg.sender].pop();
                break;
            }
        }

        // Remove the file from the sharedFiles mapping for all temporary owners
        for (uint i = 0; i < sharedWith[_url].length; i++) {
            address tempOwner = sharedWith[_url][i];
            for (uint j = 0; j < sharedFiles[tempOwner].length; j++) {
                if (keccak256(abi.encodePacked(sharedFiles[tempOwner][j])) == keccak256(abi.encodePacked(_url))) {
                    sharedFiles[tempOwner][j] = sharedFiles[tempOwner][sharedFiles[tempOwner].length - 1];
                    sharedFiles[tempOwner].pop();
                    break;
                }
            }
        }

        // Delete the file token and clear sharedWith mapping
        delete fileTokens[_url];
        delete sharedWith[_url];
    }

    function hasAccess(string memory _url, address _user) public view returns (bool) {
        FileToken storage token = fileTokens[_url];
        return _user == token.primaryOwner || token.temporaryOwners[_user];
    }

    function getFileTokenDetails(string memory _url) public view returns (
        address primaryOwner,
        string memory filename,
        uint filesize,
        uint timestamp,
        string memory fileUrl
    ) {
        FileToken storage token = fileTokens[_url];
        return (
            token.primaryOwner,
            token.filename,
            token.filesize,
            token.timestamp,
            _url
        );
    }

    function displayOwnedFiles() public view returns (string[] memory) {
        return ownerFiles[msg.sender];
    }

    function displayFilesSharedWithMe() public view returns (string[] memory) {
        return sharedFiles[msg.sender];
    }
}
