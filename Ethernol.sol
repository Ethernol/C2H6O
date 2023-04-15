pragma solidity >=0.8.3;

contract Ethernol {
    uint _price_per_fanimage = 5000000000000000;
    address _ethernol_address = 0xadC756EfB05506E373C1b650050daC0d5b57aE7C;

    mapping(address => address[]) _creator_image_mapping;

    constructor () payable {}
    receive() external payable {}
    fallback() external payable {}

    event GiveImageAddress(address image_address);

    function createFanImage(uint16 width, uint16 height, uint64 price_per_pixel) external payable {
        require(msg.value == _price_per_fanimage, "You must pay correct value!");
        
        address image_address = address(new FanImage(width, height, price_per_pixel));
        
        (bool success, ) = _ethernol_address.call{value: msg.value}("");
        require(success, "Payment failed!");
        
        _creator_image_mapping[msg.sender].push(image_address); 
        emit GiveImageAddress(image_address);
    }

    function getImages(address owner) external view returns (address[] memory) {
        return _creator_image_mapping[owner];
    }

}

contract FanImage {

    address payable _creator;
    address _owner;
    uint64 _price_per_pixel;
    uint16 _width;
    uint16 _height;

    uint[][] _img;

    constructor(uint16 width, uint16 height, uint64 price_per_pixel) payable{
        _creator = payable(msg.sender);
        _owner = msg.sender;
        _width = width;
        _height = height;
        _price_per_pixel = price_per_pixel;

        uint[][] memory arr = new uint[][](height);
        for (uint i=0; i < height; i++) {
            uint[] memory temp = new uint[](width);
            for(uint j = 0; j < width; j++){
                    temp[j] = uint(999999999); 
                }
            arr[i] = temp;
        }

        _img = arr;

    }

    receive() external payable {}
    fallback() external payable {}

    function paintPixels(uint32 amount, uint16[] calldata x, uint16[] calldata y, uint[] calldata color) external payable {
        require(msg.value == (_price_per_pixel * amount), "You must donate correct value!");
        bool abort = false;
        for(uint i = 0; i < amount; i++) {
            if(_img[y[i]][x[i]] == 999999999){
                _img[y[i]][x[i]] = color[i];
            }else{
                abort = true;
                break;
            }
        }
        require(abort == false, "At least one of the pixels is already painted!");
        (bool success, ) = _creator.call{value: msg.value}("");
        require(success, "Painting failed!");
    }

    function getPricePerPixel() external view returns (uint64) {
        return _price_per_pixel;
    }

    function getImage() external view returns (uint[][] memory) {
        return _img;
    }

    function changeOwner(address new_owner) external {
        require(msg.sender == _owner, "You are not the owner of this FanImage!");
        require(msg.sender != new_owner, "You are already the owner of this FanImage!");
        _owner = new_owner;

    }

    function getOwner() external view returns (address) {
        return _owner;
    }
}
