import StakeV2 from "./StakeV2";

export default function Stake(props) {
  return <StakeV2 {...props} />
  // const chainId = DELETE_OOOOO;
  // const isV2 = getConstant(chainId, "v2");
  // return isV2 ? <StakeV2 {...props} /> : <StakeV1 {...props} />;
}
