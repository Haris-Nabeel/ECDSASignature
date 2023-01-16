// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract RareCollection is Ownable, ERC721 {
    mapping(bytes => bool) public isSignatureValid;

    constructor() ERC721("RareCollection", "RC") {}

    // _wallet => address to whom the NFT should be minted
    // _tokenId => which token to mint (unique id provided from backend)
    // _timestamp => the timestamp used to create signature in the backend
    // _signature => the signature created using private key of admin in the backend
    function mintNft(
        address _wallet,
        uint256 _tokenId,
        uint256 _timestamp,
        bytes memory _signature
    ) external {
        require(
            !isSignatureValid[_signature],
            "RareCollection: Signature already Used"
        );
        require(msg.sender == _wallet, "RareCollection: Wallet mismatch");

        // now decoding the signer from the signature.
        address signerOwner = _signatureWallet(
            _wallet,
            _tokenId,
            _timestamp,
            _signature
        );
        // passes if the signer is recovered.
        require(
            signerOwner == owner(),
            "RareCollection: Not authorized to Mint"
        );
        isSignatureValid[_signature] = true;
        _mint(msg.sender, _tokenId);
    }

    function _signatureWallet(
        address _wallet,
        uint256 _tokenId,
        uint256 _timestamp,
        bytes memory _signature
    ) internal pure returns (address) {
        return
            ECDSA.recover(
                keccak256(abi.encode(_wallet, _tokenId, _timestamp)),
                _signature
            );
    }
}
