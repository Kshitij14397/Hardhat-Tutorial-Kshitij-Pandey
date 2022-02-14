const {expect} = require("chai");
const { ethers } = require("hardhat");

describe("Token", function(){

    let Token;
    let hardhatToken;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function(){

        Token = await ethers.getContractFactory("KPToken");
        hardhatToken = await Token.deploy();
        [owner, addr1, addr2] = await ethers.getSigners();
        
    });

    describe("Deployment", function(){

        it("Should set the right owner", async function(){
    
            expect(await hardhatToken._minter()).to.equal(owner.address);
        });
    
        it("Should assign the total supply of tokens to the owner", async function() {
           
            const ownerBalance= await hardhatToken.balanceOf(owner.address);
            expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
        });

        it("Name of the token must be equal to KPToken", async function(){

            expect(await hardhatToken.name()).to.equal("KPToken");
        });

        it("Name of the Token's symbol must be equal to KPT", async function(){

            expect(await hardhatToken.symbol()).to.equal("KPT");
        });

        it("Token's decimal value must be equal to 0", async function(){

            expect(await hardhatToken.decimals()).to.equal(0);
        });

        
        it("Overall TotalSupply must be equal to 100", async function(){

            expect(await hardhatToken.totalSupply()).to.equal(100);
        });
    
    });

    describe("Transfer", function(){

     it("Caller's Account balance should have enough tokens", async function(){
     
        await expect(hardhatToken.connect(addr1).transfer(owner.address, 50)).to.be.revertedWith("Caller account balance does not have enough tokens to spend.");
    
     });

     it("Owner's Account balance should have enough tokens", async function(){
     
        expect(await hardhatToken.transfer(addr1.address, 50));
        console.log("Owner's Account Balance "+await hardhatToken.balanceOf(owner.address));
    
     });


     it("Should transfer Tokens b/w the Accounts", async function(){

        
       //Transfer 50 Tokens from Owner to Address 1
       expect(await hardhatToken.transfer(addr1.address, 50));
       expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50);
       expect(await hardhatToken.balanceOf(owner.address)).to.equal(50);
      
       
       //Transfer 5 Tokens from Address 1 to Address 2
       expect(await hardhatToken.connect(addr1).transfer(addr2.address, 5));
       expect(await hardhatToken.balanceOf(addr2.address)).to.equal(5);
       expect(await hardhatToken.balanceOf(addr1.address)).to.equal(45);
      
       
     });

    });

 describe("mint", function(){

    it("Amount to be minted on Owner's Account", async function(){
        
        let initialOwnerBalance=await hardhatToken.balanceOf(owner.address);
        console.log(initialOwnerBalance);
        await hardhatToken.mint(100);
        expect(await hardhatToken.balanceOf(owner.address)).to.not.equal(initialOwnerBalance);
         
         await console.log(await hardhatToken.balanceOf(owner.address));
    })

    it("After Minting totalSupply will increase", async function(){
        
        let initialTotalSupply=await hardhatToken.totalSupply();
        console.log(initialTotalSupply);
        
        await hardhatToken.mint(100);
         expect(await hardhatToken.totalSupply()).to.not.equal(initialTotalSupply);

         await console.log(await hardhatToken.totalSupply());
   

    })

    it("Only Owner can mint Tokens", async function(){
        
        await expect(hardhatToken.connect(addr1).mint(50)).to.be.revertedWith("Only Owner");
    
    })

 })

 describe("Burn", function(){

    it("After Burning Caller's Account Balance will change", async function(){
         
        await hardhatToken.transfer(addr1.address, 50);
        
        let initialCallerBalance=await hardhatToken.balanceOf(addr1.address);
        
        console.log(initialCallerBalance);
        
        await hardhatToken.connect(addr1).burn(addr1.address, 25);
        
        expect(await hardhatToken.balanceOf(addr1.address)).to.not.equal(initialCallerBalance);
        
        await console.log(await hardhatToken.balanceOf(addr1.address));


    })
    
    it("After Burning Total Supply will change", async function(){

        let initialTotalSupply=await hardhatToken.totalSupply();
        console.log(initialTotalSupply);
        
        await hardhatToken.transfer(addr1.address, 50);
        
        let initialCallerBalance=await hardhatToken.balanceOf(addr1.address);
        
        console.log(initialCallerBalance);
        

        await hardhatToken.connect(addr1).burn(addr1.address, 25);
         expect(await hardhatToken.totalSupply()).to.equal(initialTotalSupply-25);

         await console.log(await hardhatToken.totalSupply());

    })


    it("Only Caller can burn tokens", async function(){

        await hardhatToken.transfer(addr1.address, 50);
        
        let initialCallerBalance=await hardhatToken.balanceOf(addr1.address); 
       
        await expect(hardhatToken.connect(addr1).burn(addr2.address, 50)).to.be.revertedWith("Only caller can burn the token of his account");
    
    })
   
 })


 describe("Transfer From", function(){

    it("Should let you give another address the approval to send on your behalf", async function(){
        await hardhatToken.approve(addr1.address, 50);
        await hardhatToken.connect(addr1).transferFrom(owner.address, addr2.address, 50);
        expect(await hardhatToken.balanceOf(owner.address)).to.equal(50);
        expect(await hardhatToken.balanceOf(addr2.address)).to.equal(50);
    })

    it("Not approved any address to send on your behalf", async function(){
        
        await expect(hardhatToken.connect(addr1).transferFrom(owner.address, addr2.address, 50)).to.be.revertedWith("Insufficient Funds or Allowance");
    })

    it("Insufficient Funds of Sender", async function(){
        
        await expect(hardhatToken.transferFrom(addr1.address, addr2.address, 50)).to.be.revertedWith("Insufficient Funds or Allowance");
    })
 })


 describe("Approve", function(){

  it("Spender assigned some amount to be spent on behalf of Caller", async function(){
    await hardhatToken.approve(addr1.address, 50);
    expect(await hardhatToken.allowance(owner.address, addr1.address)).to.equal(50);     
  })

 })

    });





    /*
    describe("Transactions", function(){
     
        it("Should transfer Tokens b/w the Accounts", async function(){
    
            //Transfer 1000 Tokens from Owner to Address 1
            await hardhatToken.transfer(addr1.address, 1000);
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal(1000);
             
            //Transfer 500 Tokens from Address 1 to Address 2
            await hardhatToken.connect(addr1).transfer(addr2.address, 500);
            expect(await hardhatToken.balanceOf(addr2.address)).to.equal(500);
        
        });
    
        it("Should fail if sender does not have enough tokens", async function(){
            const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);
    
            await expect(hardhatToken.connect(addr1).transfer(owner.address, 1000)).to.be.revertedWith("Not enough tokens");
    
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
        });
    
    
        it("Should update balances after transfers", async function(){
           
            const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);
    
            await hardhatToken.transfer(addr1.address, 1000);
            await hardhatToken.transfer(addr2.address, 500);
    
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(initialOwnerBalance-1500);
    
            const addr1Balance = await hardhatToken.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(1000);
    
    
            const addr2Balance = await hardhatToken.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(500);
    
        });
    });
    */


