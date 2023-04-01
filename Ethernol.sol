// SPDX-License-Identifier: MIT
pragma solidity >=0.8.3;

contract Ethernol {
    uint256 _price_per_fanimage = 5_000_000_000_000_000;
    address _ethernol_address = 0xadC756EfB05506E373C1b650050daC0d5b57aE7C;

    mapping(address => address[]) _creator_image_mapping;

    constructor() payable {}

    receive() external payable {}

    fallback() external payable {}

    function sendDonation(address payable supported) external payable {
        require(msg.value > 0, "You can't send nothing!");

        (bool success, ) = supported.call{ value: msg.value }('');
        require(success, 'Donation failed!');
    }

    function createFanImage(
        uint16 width,
        uint16 height,
        uint64 goal_value_wei
    ) external payable {
        require(
            msg.value == _price_per_fanimage,
            'You must pay correct value!'
        );

        _creator_image_mapping[msg.sender].push(
            address(new FanImage(width, height, goal_value_wei))
        );
        (bool success, ) = _ethernol_address.call{ value: msg.value }('');
        require(success, 'Payment failed!');
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

    // TODO: uint256 is not necessary
    uint256[][] _img;

    constructor(
        uint16 width,
        uint16 height,
        uint64 goal_value_wei
    ) payable {
        _creator = payable(msg.sender);
        _owner = msg.sender;
        _width = width;
        _height = height;
        _price_per_pixel = (width * height) / goal_value_wei;

        uint256[][] memory arr = new uint256[][](height);
        for (uint256 i = 0; i < height; i++) {
            uint256[] memory temp = new uint256[](width);
            for (uint256 j = 0; j < width; j++) {
                temp[j] = uint256(999999999);
            }
            arr[i] = temp;
        }

        _img = arr;
    }

    receive() external payable {}

    fallback() external payable {}

    function paintPixels(
        uint32 amount,
        uint16[] calldata x,
        uint16[] calldata y,
        uint256[] calldata color
    ) external payable {
        require(
            msg.value == (_price_per_pixel * amount),
            'You must donate correct value!'
        );
        bool abort = false;
        for (uint256 i = 0; i < amount; i++) {
            if (_img[y[i]][x[i]] == 999999999) {
                _img[y[i]][x[i]] = color[i];
            } else {
                abort = true;
                break;
            }
        }
        require(
            abort == false,
            'At least one of the pixels is already painted!'
        );
        (bool success, ) = _creator.call{ value: msg.value }('');
        require(success, 'Painting failed!');
    }

    function getPricePerPixel() external view returns (uint64) {
        return _price_per_pixel;
    }

    function getImage() external view returns (uint256[][] memory) {
        return _img;
    }

    function changeOwner(address new_owner) external {
        require(
            msg.sender == _owner,
            'You are not the owner of this FanImage!'
        );
        require(
            msg.sender != new_owner,
            'You are already the owner of this FanImage!'
        );
        _owner = new_owner;
    }

    function getOwner() external view returns (address) {
        return _owner;
    }
}

// contract Received {
//     event Log(uint amount);

//     receive() external payable {
//         emit Log(msg.value);
//     }
// }
