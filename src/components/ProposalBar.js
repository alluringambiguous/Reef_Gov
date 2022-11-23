import React, { useState, useEffect } from "react"
import "./ProposalBar.css"
import ProposalCard from "./ProposalCard"
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp"
import { Provider, Signer } from "@reef-defi/evm-provider"
import { WsProvider } from "@polkadot/rpc-provider"
import { Contract } from "ethers"
import GreeterContract from "../contracts/Greeter.json"
import FactoryAbi from "../constants/abi.json"
import factoryContractAddress from "../constants/contractAddress.json"
import Uik from "@reef-defi/ui-kit"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faPlus,
    faArrowDown,
    faArrowUp,
    faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons"
// import ModalTab from './Modal'

function ProposalBar({ userAddr, setOpenAlert, setUserAddr }) {
    const [proposals, setProposals] = useState([])
    const [open, setOpen] = React.useState(false)
    const [sortLatestFirst, setSortLatestFirst] = useState(true)
    
    const [lets, setLets] = useState(true)

    const [signer, setSigner] = useState()
    const [isWalletConnected, setWalletConnected] = useState(false)

    const temp = []
    const URL = "wss://rpc-testnet.reefscan.com/ws"

    // console.log(` this is in proposal ${userAddr}`)

    // console.log(contractAddress.contractAddress)

    // console.log(open)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const checkExtension = async () => {
        let allInjected = await web3Enable("Reef")

        if (allInjected.length === 0) {
            return false
        }

        let injected
        if (allInjected[0] && allInjected[0].signer) {
            injected = allInjected[0].signer
        }
        // console.log("check extension")
        const evmProvider = new Provider({
            provider: new WsProvider(URL),
        })

        evmProvider.api.on("ready", async () => {
            const allAccounts = await web3Accounts()

            allAccounts[0] && allAccounts[0].address && setWalletConnected(true)

            // console.log(allAccounts)

            const wallet = new Signer(
                evmProvider,
                allAccounts[0].address,
                injected
            )

            // Claim default account
            if (!(await wallet.isClaimed())) {
                console.log(
                    "No claimed EVM account found -> claimed default EVM account: ",
                    await wallet.getAddress()
                )
                await wallet.claimDefaultAccount()
            }

            setSigner(wallet)
        })
    }

    const checkSigner = async () => {
        if (!signer) {
            await checkExtension()
        }
        return true
    }

    // const viewAllProjects = async () => {

    //     await checkSigner()
    //     const factoryContract = new Contract(
    //         factoryContractAddress.contractAddress,
    //         FactoryAbi.abi,
    //         signer
    //   )
    //     console.log("this is the function you are looking in")

    //     const result = await factoryContract.viewAllProjects()

    //     console.log(result)

    // }
    // var contractAddrTemp = 0xBEC38F217596AC6835ef2b9e667acE177Be928E2;
    const viewAllProjects = async () => {
        await checkSigner()
        const factoryContract = new Contract(
            GreeterContract.address,
            GreeterContract.abi,
            signer
        )
        const result = await factoryContract.viewAllProjects()
        
        
        setLets(!lets)
        return result
    }

    useEffect(async () => {
        async function updateUi() {  
            

            const allProposalsFromContract = await viewAllProjects()

            let allProposalsCleaned = []
            if (userAddr)
                for (var i = 0; i < allProposalsFromContract.length; i++) {
                    const {
                        projectName,
                        uri,
                        publisher,
                        upVotes,
                        downVotes,
                        uniqueId,
                    } = await allProposalsFromContract[i]

                    const upvotes = parseInt(upVotes)
                    const downvotes = parseInt(downVotes)
                    // console.log(api.tx.system.remarkWithEvent('anighma').method.hash.toHex())

                    // console.log(`${txHash}`)

                    allProposalsCleaned.push({
                        projectName,
                        uri,
                        publisher,
                        upvotes,
                        downvotes,
                    })
                }

            setProposals(
                allProposalsCleaned
                    .map((proposal, i) => {
                        return (
                            <ProposalCard
                                // key={i}
                                // name={proposal.projectName}
                                // uri={proposal.uri}
                                // proposer={proposal.publisher}
                                // upvote={proposal.upvotes}
                                // downvote={proposal.downvotes}
                                // setOpenAlert={setOpenAlert}
                                key={1}
                                name={"test project"}
                                uri={"https://xyz.com"}
                                proposer={"anirudh"}
                                upvote={ 1}
                                downvote={0}
                                setOpenAlert={false}
                                
                            />
                        )
                    })
                    .reverse()
            )
        }
        updateUi()
        
    }, [signer])

    // for (var i = 0; i < temp.length; i++) {
    //     setProposals((oldArray) => [...oldArray, <ProposalCard />])
    // }

    return (
        <div className="proposalBarContainer">
            <div className="titleProposalContainer">
                <div className="sortingContainer">
                    <div className="sortingOptionContainer">
                        <div className="titleProposalTopContainer">
                            Latest Proposals
                        </div>
                        <div
                            className="titleProposalTopUnselectedContainer"
                            onClick={() => {
                                setSortLatestFirst(!sortLatestFirst)
                                setProposals(proposals.reverse())
                            }}
                        >
                            <div>Sort by</div>
                            <FontAwesomeIcon
                                icon={sortLatestFirst ? faArrowUp : faArrowDown}
                                width={16}
                                className="downArrowContainer"
                            />
                        </div>
                        <div className="titleProposalTopUnselectedContainer">
                            <div>Your Proposals</div>
                        </div>
                    </div>
                    <hr
                        className="lineSortContainer"
                        style={{
                            background: "#b3b3b3 ",
                            color: "#b3b3b3 ",
                            borderWidth: "0px",
                            height: "1.5px",
                            width: "90%",
                        }}
                    />
                </div>

                <div className="searchBarContainer">
                    <div className="searchNameContainer">Search</div>

                    <FontAwesomeIcon icon={faMagnifyingGlass} width={16} />
                </div>

                <div onClick={handleOpen} className="addProposalContainer">
                    <div className="addProposalButtonContainer">
                        Add Proposal
                    </div>
                    <FontAwesomeIcon
                        icon={faPlus}
                        width={16}
                        className="plusContainer"
                    />
                </div>
            </div>
            {/* <ModalTab
        userAddr={userAddr}
        open={open}
        handleClose={handleClose}
        setOpenAlert={setOpenAlert}
      /> */}
            <div className="proposalCardsContainer">{proposals }</div>
        </div>
    )
}

export default ProposalBar
