import React, { useState } from "react"
import IntroBar from "./IntroBar"
import DataBar from "../components/DataBar"
import ProposalBar from "../components/ProposalBar"

import Uik from "@reef-defi/ui-kit"
import "./MainDash.css"

function MainDash() {
	const [userAddr, setUserAddr] = useState()
	const [mainSigner, setMainSigner] = useState()

    return (
        <Uik.Container className="mainDashContainer">
            <IntroBar userAddr={userAddr} setUserAddr={setUserAddr} mainSigner={mainSigner} setMainSigner={setMainSigner} />
            <DataBar />
            <ProposalBar userAddr={userAddr} setUserAddr={setUserAddr} />
        </Uik.Container>
    )
}

export default MainDash
