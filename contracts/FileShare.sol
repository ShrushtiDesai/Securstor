// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

contract FileShare {
    struct FileToken {
        address primaryOwner;
        mapping(address => bool) temporaryOwners;
        address[] temporaryOwnerAddresses; // Array to keep track of addresses with temporary access
        string filename;
        uint filesize;
        uint timestamp;
    }

    mapping(string => FileToken) fileTokens;
    mapping(address => string[]) ownerFiles;
    mapping(address => string[]) sharedFiles;
    mapping(string => address[]) sharedWith; // Mapping to track shared addresses for each file

    function uploadfile(
        string memory _hash,
        string memory _filename,
        uint _filesize
    ) external {
        require(bytes(_hash).length > 0, "File hash cannot be empty.");
        require(bytes(_filename).length > 0, "Filename cannot be empty.");
        require(_filesize > 0, "File size must be greater than 0.");

        fileTokens[_hash].primaryOwner = msg.sender;
        fileTokens[_hash].filename = _filename;
        fileTokens[_hash].filesize = _filesize;
        fileTokens[_hash].timestamp = block.timestamp;

        ownerFiles[msg.sender].push(_hash);
    }

    function grantAccess(string memory _hash, address _temporaryOwner) external {
        require(
            msg.sender == fileTokens[_hash].primaryOwner,
            "Only the primary owner can grant access."
        );
        require(
            fileTokens[_hash].primaryOwner != address(0),
            "File does not exist."
        );
        if (fileTokens[_hash].temporaryOwners[_temporaryOwner]) {
            revert("Access has already been granted.");
        }
        fileTokens[_hash].temporaryOwners[_temporaryOwner] = true;
        fileTokens[_hash].temporaryOwnerAddresses.push(_temporaryOwner); // Add the address to the array
        sharedFiles[_temporaryOwner].push(_hash);
        sharedWith[_hash].push(_temporaryOwner); // Track the shared address
    }

    function revokeAccess(
        string memory _hash,
        address _temporaryOwner
    ) external {
        require(
            msg.sender == fileTokens[_hash].primaryOwner,
            "Only the primary owner can revoke access."
        );
        require(
            fileTokens[_hash].primaryOwner != address(0),
            "File does not exist."
        );
        if (!fileTokens[_hash].temporaryOwners[_temporaryOwner]) {
            revert("Access has not been granted.");
        }
        fileTokens[_hash].temporaryOwners[_temporaryOwner] = false;
        // Remove the address from the temporaryOwnerAddresses array
        for (
            uint i = 0;
            i < fileTokens[_hash].temporaryOwnerAddresses.length;
            i++
        ) {
            if (
                fileTokens[_hash].temporaryOwnerAddresses[i] == _temporaryOwner
            ) {
                fileTokens[_hash].temporaryOwnerAddresses[i] = fileTokens[_hash]
                    .temporaryOwnerAddresses[
                        fileTokens[_hash].temporaryOwnerAddresses.length - 1
                    ];
                fileTokens[_hash].temporaryOwnerAddresses.pop();
                break;
            }
        }
        for (uint i = 0; i < sharedFiles[_temporaryOwner].length; i++) {
            if (
                keccak256(abi.encodePacked(sharedFiles[_temporaryOwner][i])) ==
                keccak256(abi.encodePacked(_hash))
            ) {
                sharedFiles[_temporaryOwner][i] = sharedFiles[_temporaryOwner][
                    sharedFiles[_temporaryOwner].length - 1
                ];
                sharedFiles[_temporaryOwner].pop();
                break;
            }
        }
        for (uint i = 0; i < sharedWith[_hash].length; i++) {
            if (sharedWith[_hash][i] == _temporaryOwner) {
                sharedWith[_hash][i] = sharedWith[_hash][
                    sharedWith[_hash].length - 1
                ];
                sharedWith[_hash].pop();
                break;
            }
        }
    }

    function deleteFile(string memory _hash) external {
        require(
            msg.sender == fileTokens[_hash].primaryOwner,
            "Only the primary owner can delete the file."
        );
        require(
            fileTokens[_hash].primaryOwner != address(0),
            "File does not exist."
        );

        for (uint i = 0; i < ownerFiles[msg.sender].length; i++) {
            if (
                keccak256(abi.encodePacked(ownerFiles[msg.sender][i])) ==
                keccak256(abi.encodePacked(_hash))
            ) {
                ownerFiles[msg.sender][i] = ownerFiles[msg.sender][
                    ownerFiles[msg.sender].length - 1
                ];
                ownerFiles[msg.sender].pop();
                break;
            }
        }

        for (uint i = 0; i < sharedWith[_hash].length; i++) {
            address tempOwner = sharedWith[_hash][i];
            for (uint j = 0; j < sharedFiles[tempOwner].length; j++) {
                if (
                    keccak256(abi.encodePacked(sharedFiles[tempOwner][j])) ==
                    keccak256(abi.encodePacked(_hash))
                ) {
                    sharedFiles[tempOwner][j] = sharedFiles[tempOwner][
                        sharedFiles[tempOwner].length - 1
                    ];
                    sharedFiles[tempOwner].pop();
                    break;
                }
            }
        }

        delete fileTokens[_hash];
        delete sharedWith[_hash];
    }

    function hasAccess(
        string memory _hash,
        address _user
    ) public view returns (bool) {
        FileToken storage token = fileTokens[_hash];
        return _user == token.primaryOwner || token.temporaryOwners[_user];
    }

    function getFileTokenDetails(
        string memory _hash
    )
        public
        view
        returns (
            address primaryOwner,
            string memory filename,
            uint filesize,
            uint timestamp,
            string memory filehash
        )
    {
        FileToken storage token = fileTokens[_hash];
        return (
            token.primaryOwner,
            token.filename,
            token.filesize,
            token.timestamp,
            _hash
        );
    }

    function displayOwnedFiles() public view returns (string[] memory) {
        return ownerFiles[msg.sender];
    }

    function displayFilesSharedWithMe() public view returns (string[] memory) {
        return sharedFiles[msg.sender];
    }

    // Function to get the addresses with temporary access for a given file URL
    function getTemporaryOwners(
        string memory _hash
    ) public view returns (address[] memory) {
        FileToken storage token = fileTokens[_hash];
        return token.temporaryOwnerAddresses;
    }

    function getSharedOwnedFiles() public view returns (string[] memory) {
        string[] memory ownedFiles = ownerFiles[msg.sender];
        string[] memory sharedFilesArray = new string[](ownedFiles.length); // Initialize with the maximum possible size
        uint sharedCount = 0;

        for (uint i = 0; i < ownedFiles.length; i++) {
            string memory filehash = ownedFiles[i];
            address[] memory sharedWithAddresses = sharedWith[filehash];

            // Check if the file is shared with others (excluding the primary owner)
            for (uint j = 0; j < sharedWithAddresses.length; j++) {
                if (sharedWithAddresses[j] != msg.sender) {
                    sharedFilesArray[sharedCount] = filehash; // Add the file URL to the array
                    sharedCount++;
                    break; // No need to check further for this file
                }
            }
        }

        // Create a new array with the exact size of the shared files
        string[] memory result = new string[](sharedCount);
        for (uint i = 0; i < sharedCount; i++) {
            result[i] = sharedFilesArray[i];
        }

        return result;
    }
}
