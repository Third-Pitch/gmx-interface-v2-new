import { useWeb3React } from "@web3-react/core";
import Button from "components/Button/Button";
import { ethers } from "ethers";
import { getProvider } from "lib/rpc";
import { useState } from "react";
import slt from '../../abis/slt.json';
import { Trans } from "@lingui/macro";
import { TOKENS } from "config/tokens";
import { BASE } from "config/chains";
import { importImage } from "lib/legacy";

const Slt = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_loading, setLoading] = useState(false);
    const { library, chainId } = useWeb3React();
    const handleSubmit = async (address: string) => {
        setLoading(true);
        // contractFetcher(undefined, { abi: slt }, [val])
        const referralStorageAddress = address;
        const provider = getProvider(library, chainId!);
        const contract = new ethers.Contract(referralStorageAddress, slt, provider);
        await contract.claimDroplet();
        setLoading(false);
        // return codeOwner;
    }
    return (
        <div className="referral-card section-center mt-medium">
            <table className="token-table">
                <thead>
                    <tr>
                        <th style={{ textAlign: "left" }}>
                            <Trans>Coin</Trans>
                        </th>
                        <th>

                        </th>
                    </tr>
                </thead>
                <tbody>
                    {TOKENS[BASE].filter(p => !p.isPlatformToken && !p.symbol.includes("ETH")).map(p => {
                        return (
                            <tr key={p.symbol} >
                                <td style={{ textAlign: "left" }}>
                                    <div style={{ display: "flex", alignItems: "center", columnGap: 24 }}>
                                        <img src={importImage(
                                            "ic_" + p.symbol.toLocaleLowerCase() + "_40.svg"
                                        )} alt={p.name} width="40px" />
                                        {p.symbol}
                                    </div>
                                </td>
                                <td>
                                    <Button onClick={() => {
                                        handleSubmit(p.address);
                                    }} variant="secondary" >
                                        <Trans>Receive</Trans>
                                    </Button>
                                </td>
                            </tr>
                        )
                    })}

                </tbody>
            </table>
        </div>
        // <div className="referral-card section-center mt-medium">
        //     <h2 className="title">
        //         快来领取赏赐
        //     </h2>
        //     <p className="sub-title">
        //         哈哈哈哈
        //     </p>
        //     <div className="card-action">
        //         <form onSubmit={handleSubmit}>
        //             <input
        //                 // ref={inputRef}
        //                 // disabled={isSubmitting}
        //                 type="text"
        //                 placeholder="输入合约地址"
        //                 className="text-input mb-sm"
        //                 value={val}
        //                 onChange={(e) => setVal(e.target.value)}
        //             // value={referralCode}
        //             // onChange={({ target }) => {
        //             //     const {value} = target;
        //             //     setReferralCode(value);
        //             // }}
        //             />
        //             <Button
        //                 disabled={loading}
        //                 variant="primary-action"
        //                 type="submit"
        //                 className="App-cta Exchange-swap-button"
        //             >
        //                 {loading ? "领取中..." : `耻辱拿走😧`}
        //             </Button>
        //         </form>
        //         {/* {active ? (
        //             <ReferralCodeForm setPendingTxns={setPendingTxns} pendingTxns={pendingTxns} />
        //         ) : (
        //             <Button variant="primary-action" className="w-full" type="submit" onClick={connectWallet}>
        //                 <Trans>Connect Wallet</Trans>
        //             </Button>
        //         )} */}
        //     </div>
        // </div>
    )
}

export default Slt;