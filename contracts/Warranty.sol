pragma solidity >=0.8.0;
pragma experimental ABIEncoderV2;
// import "@openzeppelin/contracts/utils/Strings.sol";

contract Warranty {
	address owner;
	uint fileCount = 0;
	
	struct FileData{
        address owner;
        uint fileID;
        string fileURL;
        string fileName;
		int price;
        int fileSize;
        string fileDescription;
        uint uploadTime;
		uint warrantyTime;
    }

    event FileUploaded(
        address owner,
        uint fileID,
        string fileURL,
        string fileName,
		int price,
        int fileSize,
        string fileDescription,
        uint uploadTime,
		uint warrantyTime
    );
	mapping(address => FileData[]) public fileMap;

	constructor() public {
		owner = msg.sender;
	}

	function uploadFile(address _owner, string memory _fileURL, string memory _fileName,int _price, int _fileSize, string memory _fileDescription, uint _warrantyTime) public{
        if(
            bytes(_fileURL).length > 0 &&
            bytes(_fileName).length > 0 &&
            _fileSize > 0 &&
            bytes(_fileDescription).length > 0 &&
            msg.sender != address(0)
        ){
            fileMap[owner].push(FileData(_owner, fileCount, _fileURL, _fileName, _price, _fileSize, _fileDescription, block.timestamp, _warrantyTime));

            emit FileUploaded(_owner, fileCount, _fileURL, _fileName,_price, _fileSize, _fileDescription, block.timestamp, _warrantyTime);
            fileCount++;
        }
    }

	function getOwner() public view returns(address){
		return owner;
	}
    	
    function transferOwner(address newOwner, uint ID) public{
        FileData memory transferOwnership = fileMap[owner][ID];
        fileMap[owner][ID].owner = newOwner;
		fileMap[newOwner].push(transferOwnership);
	}


    function getFileCount() public view returns(uint){
		return fileCount;
	}

	function getData(address ownerAddress) public view returns(FileData[] memory){
		return fileMap[ownerAddress];
	}
}
