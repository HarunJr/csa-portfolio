import {
    Blockfrost, Lucid, Credential, TxHash, Lovelace, Constr, SpendingValidator, Data, fromText, toText, Unit, MintingPolicy,
    PolicyId, Address, UTxO, applyParamsToScript, Assets, ScriptHash, Redeemer, paymentCredentialOf, KeyHash,
    generatePrivateKey, getAddressDetails, toUnit, Datum, Validator,
} from 'lucid-cardano'
import { getMintingPolicy, getPolicyId, getUnit, savePolicyData, getNftUtxo } from './minitng'
import initLucid from './lucid'
import { createMintData, getMintData, MintData } from "../utils/backend";

const paramScriptCbor = "5910e65910e30100003232323232323322323232323232323232323322332232323233223232323233322232323232323232323232323232323232323232323232323232323232323222233550272232323232323232323232322322323253353330123333573466e1cd55cea8082400046666666666644444444444246666666666600201801601401201000e00c00a0080060046eb8d5d0a8081bae35742a01e666aa0a2eb9d71aba1500e375a6ae854034dd71aba1500c3335505175ceb8d5d0a8059bad35742a014666aa0a2eb9d71aba15009375a6ae854020dd69aba15007375a6ae84d5d1280391931902999ab9c0550530513333573466e1d401120042122200123333573466e1d401520022122200223333573466e1d40192000212220032326320553357380ae0aa0a60a40a26666ae68cdc39aab9d5002480008cc8848cc00400c008c8c8c8c8c8c8c8c8c8c8c8c8c8cccd5cd19b8735573aa018900011999999999999111111111110919999999999980080680600580500480400380300280200180119a8128131aba1500c33502502635742a01666a04a04e6ae854028ccd540a5d728141aba150093335502975ca0506ae854020cd40940b8d5d0a803999aa814817bad35742a00c6464646666ae68cdc39aab9d5002480008cd4140c8c8c8cccd5cd19b8735573aa0049000119a82b19a81cbad35742a00460746ae84d5d1280111931903499ab9c06b069067135573ca00226ea8004d5d0a8011919191999ab9a3370e6aae7540092000233505533503975a6ae854008c0e8d5d09aba250022326320693357380d60d20ce26aae7940044dd50009aba135744a004464c640ca66ae7019c19418c4d55cf280089baa00135742a00a66a04aeb8d5d0a802199aa81481590009aba150033335502975c40026ae854008c0b4d5d09aba250022326320613357380c60c20be26ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aab9e5001137540026ae854008c074d5d09aba250022326320533357380aa0a60a220a4264c640a466ae712410350543500052135573ca00226ea80044d55ce9baa001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226aae7940044dd5000991111919192999a8028998131980da49287369676e65644279426f72726f7765723a204e6f74207369676e656420627920626f72726f77657200335502e302f5001303f006330263301b49013574784861734f6e655363496e7075744f6e6c793a20547820446f6573206e6f74206861766520612073637269707420696e70757420003302c33223333550023233503f2233350400030010023503d00133503e22230033002001200122337000029001000a400060722400266aa05c66aa60802400244a66aa66a00442072206e266a08a0040022002a08866644466aa00600400260842400266aaa08246a0024466a0044a06846a06a00266aaa08246a002444400846a00244002646a002444444444444018a00290011980da490e4e4654206e6f74206d696e746564005335335502e01f301a5001103522135002222533500413302b33032003304300c3302b33032002304200b33031001480088840f04cc098cc06d241227369676e65644279426f72726f7765723a2057726f6e67207075626b65796861736800335502e302f5002303f006330263301b490128646561646c696e655061737365643a20446561646c696e65206e6f7420796574207265616368656400333502250273501e301d006301950023301b49012576616c69646174654275726e3a20426f72726f776572204e4654206e6f74206275726e6564005335335502e01f301a5002103522135002222533500413302b33032003304300c3302b33032002304200b33031001480048840f04cc098cc06d24128646561646c696e655061737365643a20446561646c696e65206e6f7420796574207265616368656400333502250273501e301d00630195003330263301b49140636f6e7461696e735265717569726564436f6c6c61746572616c416d6f756e743a204e6f7420526571756972656420436f6c6c61746572616c20416d6f756e7400333553039120013233503d223335003220020020013500122001123300122533500210391001036233029323235001223232300100632001355050223350014800088d4008894cd4ccd5cd19b8f00200904204113007001130060033200135504f223350014800088d4008894cd4ccd5cd19b8f00200704104010011300600335008222222222220093500122220033500722222222222008323500122222222222200a50033301b49012576616c69646174654275726e3a20426f72726f776572204e4654206e6f74206275726e6564005335335502e01f301a5003103522135002222533500413302b330320033500c220023302b330320023500b2222222222200733031001480088840f04c06c00c4c0680084c064004cc8848cc00400c008dd70019bae0021232230023758002640026aa080446666aae7c004940f48cd40f0c010d5d080118019aba200203f232323333573466e1cd55cea8012400046644246600200600460146ae854008c014d5d09aba2500223263203f33573808207e07a26aae7940044dd50009191919191999ab9a3370e6aae75401120002333322221233330010050040030023232323333573466e1cd55cea8012400046644246600200600460266ae854008cd4034048d5d09aba2500223263204433573808c08808426aae7940044dd50009aba150043335500875ca00e6ae85400cc8c8c8cccd5cd19b875001480108c84888c008010d5d09aab9e500323333573466e1d4009200223212223001004375c6ae84d55cf280211999ab9a3370ea00690001091100191931902319ab9c048046044043042135573aa00226ea8004d5d0a80119a804bae357426ae8940088c98c8100cd5ce02102001f09aba25001135744a00226aae7940044dd5000899aa800bae75a224464460046eac004c8004d540f488c8cccd55cf8011281d919a81d19aa81f98031aab9d5002300535573ca00460086ae8800c0f44d5d080089119191999ab9a3370ea002900011a81318029aba135573ca00646666ae68cdc3a801240044a04c464c6407a66ae700fc0f40ec0e84d55cea80089baa001232323333573466e1d400520062321222230040053007357426aae79400c8cccd5cd19b875002480108c848888c008014c024d5d09aab9e500423333573466e1d400d20022321222230010053007357426aae7940148cccd5cd19b875004480008c848888c00c014dd71aba135573ca00c464c6407a66ae700fc0f40ec0e80e40e04d55cea80089baa001232323333573466e1cd55cea80124000466442466002006004600a6ae854008dd69aba135744a004464c6407266ae700ec0e40dc4d55cf280089baa0012323333573466e1cd55cea800a400046eb8d5d09aab9e500223263203733573807206e06a26ea80048c8c8c8c8c8cccd5cd19b8750014803084888888800c8cccd5cd19b875002480288488888880108cccd5cd19b875003480208cc8848888888cc004024020dd71aba15005375a6ae84d5d1280291999ab9a3370ea00890031199109111111198010048041bae35742a00e6eb8d5d09aba2500723333573466e1d40152004233221222222233006009008300c35742a0126eb8d5d09aba2500923333573466e1d40192002232122222223007008300d357426aae79402c8cccd5cd19b875007480008c848888888c014020c038d5d09aab9e500c23263204033573808408007c07a07807607407207026aae7540104d55cf280189aab9e5002135573ca00226ea80048c8c8c8c8cccd5cd19b875001480088ccc888488ccc00401401000cdd69aba15004375a6ae85400cdd69aba135744a00646666ae68cdc3a80124000464244600400660106ae84d55cf280311931901c99ab9c03b039037036135573aa00626ae8940044d55cf280089baa001232323333573466e1d400520022321223001003375c6ae84d55cf280191999ab9a3370ea004900011909118010019bae357426aae7940108c98c80d8cd5ce01c01b01a01989aab9d50011375400224464646666ae68cdc3a800a40084a04a46666ae68cdc3a8012400446a04e600c6ae84d55cf280211999ab9a3370ea00690001091100111931901b99ab9c039037035034033135573aa00226ea80048c8cccd5cd19b8750014800880848cccd5cd19b8750024800080848c98c80cccd5ce01a81981881809aab9d375400246a00244444444444400a46a00244444444444401044a66a002203a266ae700080708d4004880088d40048888888888800848cd4054cd405cd406c004064cd405940680648cc0094098004c8004d540a88894cd40044008884d400888cc01cccc02000801800400cc8004d540a488894cd40044008884d4008894cd4ccd5cd19b87001480000740704ccc02001c01800c4ccc02001ccd40a848ccc00402000c00801800c4888d400888d400888d401488d4008894ccd4ccd403402c01800854cd400454cd40144ccd403002c00c01c40784ccd403002c00c01c40784ccd403002c00c01c4888d400888d400c894ccd4ccd402001c01000854cd400c40044068406440684888c8c8c8c94ccd4018854ccd4018854ccd402084c011261300349854ccd401c84c01126130034984040403854ccd401c84c011261300349854ccd401884c0112613003498403c54ccd4014840344038403054ccd4014854ccd401c84c015261300449854ccd401884c0152613004498403c403454ccd401884c015261300449854ccd401484c0152613004498403894ccd4014854ccd401c854ccd401c84ccd402c028008004585858403854ccd4018854ccd401884ccd40280240080045858584034403094ccd4010854ccd4018854ccd401884ccd4028024008004585858403454ccd4014854ccd401484ccd40240200080045858584030402c94ccd400c854ccd4014854ccd401484ccd4024020008004585858403054ccd4010854ccd401084ccd402001c008004585858402c402894ccd4008854ccd4010854ccd401084ccd402001c008004585858402c54ccd400c854ccd400c84ccd401c0180080045858584028402448d40048888888801c894cd400840044044448cccccccc004018894cd4ccd5cd19b87002001012011100715335333573466e240080040480444014401888ccd5cd19b8800200101201122333573466e2400800404804488ccd5cd19b89002001011012002225335333573466e2400800404804440044008894cd4ccd5cd19b890020010120111002100122333573466e2000800403c040488800c4888008488800488ccd5cd19b8700200100c00b22333573466e3c00800402c0284488c00800488d40088888888888894cd4ccd54c06048004cd406c894cd40088400c4005403c94cd4ccd5cd19b8f00e0010160151350110011501000421016101412122300200311220011221233001003002122123300100300212212330010030021220021220011212223003004112220013200135501122112225335001135006003221333500900530040023335530071200100500400112350012200112350012200212212330010030022350012222222222200b235001220012350012222222222200a3200135500a22112225335001100222133005002333553007120010050040011112223003300200132001355008221122533500115006221335007300400233553006120010040011122002122122330010040031122232323333573466e1cd55cea80124000466aa012600c6ae854008c014d5d09aba2500223263200833573801401000c26aae7940044dd5000a4c240022244246600200600492010350543100112323001001223300330020020011"

const borrowName = fromText("BorrowNFT");
const lendName = fromText("LendNFT");
const djedName = fromText("Djed_testMicroUSD");

const MintRedeemerSchema = Data.Enum([
    Data.Literal("Mint"),
    Data.Literal("Burn"),
]);
type MintRedeemer = Data.Static<typeof MintRedeemerSchema>;
const MintRedeemer = MintRedeemerSchema as unknown as MintRedeemer;

const RequestRedeemerSchema = Data.Enum([
    Data.Literal("Borrow"),
    Data.Literal("Cancel"),
    Data.Literal("Lend"),
]);
type RequestRedeemer = Data.Static<typeof RequestRedeemerSchema>;
const RequestRedeemer = RequestRedeemerSchema as unknown as RequestRedeemer;

export const requestValidator = (lendPolicyId: PolicyId, borrowPolicyId: PolicyId) => {
    const Parameter = Data.Object({
        lenderNftCs: Data.Bytes(),
        borrowersNftCs: Data.Bytes(),
    });

    type Parameter = Data.Static<typeof Parameter>;

    const parameter: Parameter = {
        lenderNftCs: lendPolicyId,
        borrowersNftCs: borrowPolicyId,
    };

    const validator: SpendingValidator = {
        type: "PlutusV2",
        script: applyParamsToScript<[Parameter]>(paramScriptCbor, [parameter], Data.Tuple([Parameter]),)
    };
    return validator;
}

export const getValidatorsFromDB = async (): Promise<Address[]> => {
    try {
        const { mintsInfo }: { mintsInfo: MintData[] } = await getMintData();
        let validatorAddresses: Address[] = []; // Initialize an empty array to store the addresses
        if (mintsInfo) {
            for (const mint of mintsInfo) {
                validatorAddresses.push(mint.scriptAddress)
            }
        }
        return validatorAddresses;
    } catch (error) {
        console.error('getDatumFromContract: Error fetching datum:', error);
        return [];
    }

};

//This works but the constructor are a challenge to handle
const buildRequestDatum = (pkh: string, borrowTn: string, collateralAmount: bigint, lendTn: string) => {
    const dJedId: PolicyId = "9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe"
    const dJed = getUnit(dJedId, djedName);
    const Ada = getUnit("", fromText(""))
    const borrowersNftTn = new Constr(0, [borrowTn]);
    const borrower = new Constr(0, [pkh]);
    const collateral = new Constr(0, [Ada]);
    const collateralAmnt = new Constr(0, [Data.to(collateralAmount)]);
    const lenderNftTn = new Constr(0, [lendTn]);
    const interest = new Constr(0, [Data.to(BigInt(10))]);
    const interestamnt = new Constr(0, [Data.to(BigInt(5_000_000))]);
    const loan = new Constr(0, [new Constr(0, [dJedId]), new Constr(0, [fromText("Djed_testMicroUSD")])])
    const loanAmnt = new Constr(0, [Data.to(BigInt(15_000_000))]);
    const requestExpiration = new Constr(0, [Data.to(BigInt(new Date('3/15/2024').getTime()))]);
    const lendDate = new Constr(0, [Data.to(BigInt(Date.now()))]);

    return new Constr(0, [
        borrowersNftTn,
        borrower,
        collateral,
        collateralAmnt,
        lenderNftTn,
        interest,
        interestamnt,
        loan,
        loanAmnt,
        requestExpiration,
        lendDate,
        // gToken,
    ]);
}


export const borrowRequest = async (lucid: Lucid) => {

    // const MintRedeemer = () => Data.to(new Constr(0, []))
    // const BorrowRedeemer = () => Data.to(new Constr(0, []))

    if (lucid) {
        const utxos = await lucid.wallet.getUtxos();

        if (utxos.length == 0) throw 'No UTxO available';

        const { paymentCredential } = lucid.utils.getAddressDetails(await lucid.wallet.address())
        console.log(paymentCredential!.hash)
        const pkh = paymentCredential!.hash
        const parameter = new Constr(0, [paymentCredential!.hash])

        const Redeemer = () => Data.to(new Constr(0, []))

        const borrowPolicy = getMintingPolicy(utxos[0], borrowName);
        const lendPolicy = getMintingPolicy(utxos[0], lendName);

        // PolicyId is the same as Currency symbol
        const borrowPolicyId: PolicyId = lucid!.utils.mintingPolicyToId(borrowPolicy)
        const lendPolicyId: PolicyId = lucid!.utils.mintingPolicyToId(lendPolicy)

        // const borrowId = getPolicyId(lucid, borrowPolicy);
        // const lendId = getPolicyId(lucid, lendPolicy);

        const borrowAssetName = getUnit(borrowPolicyId, borrowName);
        const lendAssetName = getUnit(lendPolicyId, lendName);

        const myValidator = requestValidator(lendPolicyId, borrowPolicyId);
        const requestAddress: Address = lucid.utils.validatorToAddress(myValidator);
        console.log("requestAddress: " + requestAddress)
        // requestAddress: addr_test1wzsq22a7x5gl3ku7w2fxjehvexrzz7dvyzjcfpyth8ndt0geg6ltw

        const collateralAmount = BigInt(5_000_000);

        const requestDatum = buildRequestDatum(pkh, borrowName, collateralAmount, lendName);
        // const requestDatum = buildBorrowDatum(pkh, borrowName, collateralAmount, lendName);


        // Create a new variable with a value that matches the MintRedeemer type
        const mintRedeemerValue: MintRedeemer = "Mint";
        const mintRedeemer = Data.to<MintRedeemer>(mintRedeemerValue, MintRedeemer);

        // Create a new variable with a value that matches the BorrowRedeemer type
        const borrowRedeemerValue: RequestRedeemer = "Borrow";
        const borrowRedeemer = Data.to<RequestRedeemer>(borrowRedeemerValue, RequestRedeemer);

        const txHash = await lucid.newTx()
            .collectFrom([utxos[0]], borrowRedeemer)
            .payToContract(requestAddress, { inline: Data.to(requestDatum) }, { lovelace: collateralAmount })
            .mintAssets({ [borrowAssetName]: BigInt(1) }, mintRedeemer)
            .attachMintingPolicy(borrowPolicy)
            .attachMetadata(721, { requestDatum })
            .complete()
            .then((tx) => tx.sign().complete())
            .then((tx) => tx.submit())

        if (!txHash) {
            throw new Error('Failed to Mint NFT');
        }

        // setScriptAddress(requestAddress);
        const newMintData = {
            tokenName: borrowName,
            borrowPolicyId: borrowPolicyId,
            lendPolicyId: lendPolicyId,
            mintingPolicy: JSON.stringify(borrowPolicy),
            scriptAddress: requestAddress,
            validator: JSON.stringify(myValidator)
        };

        // Saves the mint data in local central DB
        createMintData(newMintData);
        // savePolicyData(borrowPolicy, borrowId, borrowName, requestAddress)
        console.log("Lock Test TxHash: " + txHash)
    }
}


const mapDatumFields = (datum: any) => {
    return {
        borrowersNftTn: datum.fields[0].fields[0] || [],
        borrower: datum.fields[1].fields[0] || [],
        collateral: datum.fields[2].fields[0] || [],
        collateralAmnt: datum.fields[3].fields[0] || [],
        lenderNftTn: datum.fields[4].fields[0] || [],
        interest: datum.fields[5].fields[0] || [],
        interestAmnt: datum.fields[6].fields[0] || [],
        loan: {
            loanId: datum.fields[7].fields[0].fields[0] || [],
            loanName: datum.fields[7].fields[1].fields[0] || []
        },
        loanAmnt: datum.fields[8].fields[0] || [],
        requestExpiration: datum.fields[9].fields[0] || [],
        lendDate: datum.fields[10].fields[0] || [],
    };
};

export const getScriptDatum = async (lucid: Lucid, contractAddress: Address) => {
    let datums: any[] = []; // Initialize an empty array to store the addresses
    // let allDatums: DatumI[][] = []; // Initialize an empty array to store all datums
    if (lucid) {
        const utxos = await lucid.utxosAt(contractAddress);
        let utxo: UTxO, utxoDatum, datumFields;

        if (utxos.length == 0) throw 'No UTxO available';
        for (let i = 0; i < utxos.length; i++) {
            utxo = utxos[i];
            if (utxo.datumHash && !utxo.datum) {
                utxo.datum = await lucid.datumOf(utxo);
            }
            utxoDatum = mapDatumFields(Data.from(utxo.datum!));
            console.log("datumFields: " + JSON.stringify(utxoDatum, null, 2));
            // console.log("datumName: " + toText(utxoDatum.borrowersNftTn));
            const datumJson = JSON.stringify(utxoDatum, null, 2);
            datums.push(datumJson);
        }

        console.log("allDatums: ", datums.length);
        return datums;
    }
};

export const cancelRequest = async (lucid: Lucid, index: number, datum: any) => {
    const CancelRedeemer = () => Data.to(new Constr(1, []))

    const cancelRedeemerValue: RequestRedeemer = "Cancel";
    const cancelRedeemer = Data.to<RequestRedeemer>(cancelRedeemerValue, RequestRedeemer)

    const burnRedeemerValue: MintRedeemer = "Burn";
    const burnRedeemer = Data.to<MintRedeemer>(burnRedeemerValue, MintRedeemer)

    console.log("cancelRequest: " + index);
    console.log("cancelRequest: datum: " + new Date(Number(Data.from(datum.lendDate))).toLocaleString());
    // const borrowPolicyId: PolicyId = lucid!.utils.mintingPolicyToId(borrowPolicy)

    try {
        const { mintsInfo }: { mintsInfo: MintData[] } = await getMintData();

        if (lucid) {
            const walletAddress = await lucid.wallet.address();
            const { paymentCredential } = lucid.utils.getAddressDetails(await lucid.wallet.address())
            let borrowPolicyId: PolicyId = "";
            let lendPolicyId: PolicyId = "";
            let scriptAddress: Address = "";
            let myValidator: Validator = {
                type: 'PlutusV2',
                script: ''
            };
            let mintingPolicy: MintingPolicy = {
                type: 'PlutusV2',
                script: ''
            };
            if (mintsInfo) {
                for (const mint of mintsInfo) {
                    borrowPolicyId = mint.borrowPolicyId
                    lendPolicyId = mint.lendPolicyId
                    mintingPolicy = JSON.parse(mint.mintingPolicy)
                    scriptAddress = mint.scriptAddress
                    myValidator = JSON.parse(mint.validator)
                }
                const reqValidator: SpendingValidator = requestValidator(lendPolicyId, borrowPolicyId);
                const requestAddress: Address = lucid.utils.validatorToAddress(reqValidator);
                console.log("cancelRequest: borrowPolicyId:... ", borrowPolicyId);
                console.log("cancelRequest: lendPolicyId:... ", lendPolicyId);
                console.log("cancelRequest: validator:... ", JSON.stringify(reqValidator));
                console.log("cancelRequest: requestAddress:... ", scriptAddress);
                console.log("cancelRequest: tokenName:... ", toText(datum.borrowersNftTn));
                console.log("cancelRequest: mintingPolicy:... ", JSON.stringify(mintingPolicy));
                console.log("cancelRequest: paymentCredential:... ", paymentCredential?.hash!);
                console.log("cancelRequest: address:... ", walletAddress);
                console.log("cancelRequest: datum.borrower:... ", datum.borrower);
                const borrowerUtxos = await lucid.wallet.getUtxos();
                if (borrowerUtxos.length == 0) throw 'No UTxO available';
                const borrowPolicy = getMintingPolicy(borrowerUtxos[0], datum.borrowersNftTn);

                const utxos = (await lucid.utxosAt(requestAddress));
                if (utxos.length == 0) throw 'No UTxO available';

                console.log("cancelRequest: collateralAmnt:... ", Data.from(datum.collateralAmnt));
                const collateralAmnt = BigInt(Data.from(datum.collateralAmnt));

                const assetName = getUnit(borrowPolicyId, datum.borrowersNftTn);

                if (datum.borrower == paymentCredential?.hash!) {
                    console.log("Found your request UTXO... " + utxos[0].txHash + " #" + utxos[0].outputIndex);
                    const txHash = await lucid.newTx()
                        .collectFrom([utxos[0]], CancelRedeemer())
                        // .payToAddress(walletAddress, { lovelace: collateralAmnt })
                        .attachSpendingValidator(reqValidator)
                        // .addSignerKey(paymentCredential?.hash!)
                        // .mintAssets({ [assetName]: BigInt(-1) }, burnRedeemer)
                        // .attachMintingPolicy(mintingPolicy)
                        .validFrom(Date.now())
                        .validTo(new Date('3/20/2024').getTime())
                        .complete()
                        .then((tx) => tx.sign().complete())
                        .then((tx) => tx.submit())


                    if (!txHash) {
                        throw new Error('Failed to Cancel Request');
                    }
                }

            } else {
                console.log("Not the same");
            }
        }
    } catch (error) {
        console.error('cancelRequest: Error Cancelling Request:', error);
    }
}
