/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require('@nomiclabs/hardhat-waffle')

 const ALCHEMY_API_KEY = "fXFVauveWZlhtL6NThSWqw9_nfIPzDxw";
 const RINKEBY_PRIVATE_KEY = "35ea6ee67c4fca0897319a3011a99c02f68cace76a5592e65d525dcea3906c31";
 
 module.exports = {
   solidity: "0.7.3",
 
   networks: {
 
     rinkeby: {
       url:`https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
       accounts: [`${RINKEBY_PRIVATE_KEY}`],
     },
   },
 };
 