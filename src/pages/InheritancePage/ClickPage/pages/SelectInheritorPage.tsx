import React, { useEffect, useState } from "react";
import * as styled from "../styles";
import { PageProps } from "../types";
import { InheritorModal } from "../components/InheritorModal";
import BlueButton from "../../../../ui/BlueBtn";
import WhiteButton from "../../../../ui/WhiteBtn";

export const SelectInheritorPage: React.FC<PageProps> = ({
    onNext,
    onPrev,
    formData,
    setFormData,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<string>("");
    const [wasZero, setWasZero] = useState<{ [key: string]: boolean }>({});

    const [inheritanceInfo, setInheritanceInfo] = useState<{
        [key: string]: {
            inheritors: Array<{
                id: string;
                name: string;
                relation: string;
                ratio: number;
            }>;
        };
    }>(formData.inheritanceInfo);

    const getRemainingRatio = (
        assetId: string,
        excludeInheritorId?: string
    ) => {
        if (!inheritanceInfo[assetId]) {
            return 100; // 해당 자산이 없으면 100% 반환
        }

        const totalRatio = inheritanceInfo[assetId].inheritors
            .filter((inheritor) => inheritor.id !== excludeInheritorId)
            .reduce((sum, inheritor) => sum + inheritor.ratio, 0);
        return 100 - totalRatio;
    };

    const handleAddInheritor = (data: { name: string; relation: string }) => {
        const remainingRatio = getRemainingRatio(selectedAsset);
        const newInheritor = {
            id: Date.now().toString(),
            name: data.name,
            relation: data.relation,
            ratio: remainingRatio,
        };

        setInheritanceInfo((prev) => {
            const currentAssetInfo = prev[selectedAsset] || { inheritors: [] };

            const updatedInfo = {
                ...prev,
                [selectedAsset]: {
                    inheritors: [...currentAssetInfo.inheritors, newInheritor],
                },
            };

            setFormData((prevFormData) => ({
                ...prevFormData,
                inheritanceInfo: updatedInfo,
            }));

            return updatedInfo;
        });
        setIsModalOpen(false);
    };

    const handleRatioChange = (
        assetId: string,
        inheritorId: string,
        newRatio: number | string,
        isTyping: boolean = false
    ) => {
        if (newRatio === "") {
            setWasZero((prev) => ({ ...prev, [inheritorId]: true }));
            newRatio = "0";
        } else {
            setWasZero((prev) => ({ ...prev, [inheritorId]: false }));
        }

        if (newRatio === "-") return;

        const numericRatio =
            typeof newRatio === "string" ? parseFloat(newRatio) : newRatio;
        if (isNaN(numericRatio)) return;

        setInheritanceInfo((prev) => {
            const asset = prev[assetId];
            const currentInheritor = asset.inheritors.find(
                (inheritor) => inheritor.id === inheritorId
            );

            if (!currentInheritor) return prev;

            const otherInheritorsTotal = asset.inheritors
                .filter((inheritor) => inheritor.id !== inheritorId)
                .reduce((sum, inheritor) => sum + inheritor.ratio, 0);

            const maxPossibleRatio = 100 - otherInheritorsTotal;
            const limitedRatio = Number(
                Math.min(Math.max(0, numericRatio), maxPossibleRatio).toFixed(
                    isTyping ? 20 : 1
                )
            );

            const updatedInheritors = asset.inheritors.map((inheritor) => {
                if (inheritor.id === inheritorId) {
                    return { ...inheritor, ratio: limitedRatio };
                }
                return inheritor;
            });

            const updatedInfo = {
                ...prev,
                [assetId]: {
                    ...asset,
                    inheritors: updatedInheritors,
                },
            };

            setFormData((prevFormData) => ({
                ...prevFormData,
                inheritanceInfo: updatedInfo,
            }));

            return updatedInfo;
        });
    };

    const handleDeleteInheritor = (assetId: string, inheritorId: string) => {
        setInheritanceInfo((prev) => {
            const asset = prev[assetId];
            const remainingInheritors = asset.inheritors.filter(
                (inheritor) => inheritor.id !== inheritorId
            );

            const updatedInfo = {
                ...prev,
                [assetId]: {
                    ...asset,
                    inheritors: remainingInheritors,
                },
            };

            setFormData((prevFormData) => ({
                ...prevFormData,
                inheritanceInfo: updatedInfo,
            }));

            return updatedInfo;
        });
    };

    const renderAssetBox = (
        assetId: string,
        title: string,
        detail: string,
        value: string,
        hasInheritors: boolean
    ) => (
        <styled.SelectInheriPageWhiteBox>
            <styled.AddInheritorBtn
                onClick={() => {
                    setSelectedAsset(assetId);
                    setIsModalOpen(true);
                }}
            >
                +
            </styled.AddInheritorBtn>
            <styled.AssetInfoSubtitle>{title}</styled.AssetInfoSubtitle>
            <styled.AssetInfoAddress>
                {detail}
                <br />
                <span>{value}</span>
            </styled.AssetInfoAddress>

            {inheritanceInfo[assetId]?.inheritors.length > 0 ? (
                <>
                    <styled.InheritorDivider />
                    <styled.InheritorInfo>
                        <styled.InheritanceRatio>
                            {Math.min(
                                100,
                                Number(
                                    inheritanceInfo[assetId].inheritors
                                        .reduce(
                                            (sum, inheritor) =>
                                                sum + inheritor.ratio,
                                            0
                                        )
                                        .toFixed(1)
                                )
                            )}
                            % 완료
                        </styled.InheritanceRatio>
                        {inheritanceInfo[assetId].inheritors.map(
                            (inheritor) => (
                                <styled.ProgressBarContainer key={inheritor.id}>
                                    <styled.ProgressLabel>
                                        {inheritor.name}
                                    </styled.ProgressLabel>
                                    <styled.ProgressSlider
                                        type="range"
                                        min={0}
                                        max={100}
                                        value={inheritor.ratio}
                                        onChange={(e) =>
                                            handleRatioChange(
                                                assetId,
                                                inheritor.id,
                                                parseFloat(e.target.value)
                                            )
                                        }
                                        $value={inheritor.ratio}
                                    />
                                    <styled.ProgressInput
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={
                                            wasZero[inheritor.id]
                                                ? ""
                                                : inheritor.ratio
                                        }
                                        onChange={(e) => {
                                            handleRatioChange(
                                                assetId,
                                                inheritor.id,
                                                e.target.value,
                                                true
                                            );
                                        }}
                                        onBlur={(e) => {
                                            const value =
                                                e.target.value === ""
                                                    ? "0"
                                                    : e.target.value;
                                            const numericValue =
                                                parseFloat(value);
                                            if (!isNaN(numericValue)) {
                                                handleRatioChange(
                                                    assetId,
                                                    inheritor.id,
                                                    numericValue.toFixed(1)
                                                );
                                            }
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontFamily: "Pretendard",
                                            fontSize: "14px",
                                            marginLeft: "2px",
                                        }}
                                    >
                                        %
                                    </span>
                                    <styled.DeleteButton
                                        onClick={() =>
                                            handleDeleteInheritor(
                                                assetId,
                                                inheritor.id
                                            )
                                        }
                                        type="button"
                                    >
                                        ×
                                    </styled.DeleteButton>
                                </styled.ProgressBarContainer>
                            )
                        )}
                    </styled.InheritorInfo>
                </>
            ) : (
                <styled.SelectInheriPageBody>
                    상속인을 설정하지 않았습니다.
                </styled.SelectInheriPageBody>
            )}
        </styled.SelectInheriPageWhiteBox>
    );

    const renderAssets = () => {
        const assets = formData.assets;

        return (
            <>
                <styled.AssetInfoTitle>부동산</styled.AssetInfoTitle>
                {assets.realEstate.map((asset, index) =>
                    renderAssetBox(
                        asset.id,
                        `${index + 1}. ${asset.type}`,
                        asset.address,
                        `${asset.value}원`,
                        inheritanceInfo[asset.id]?.inheritors?.length > 0
                    )
                )}

                <styled.SelectInheriPageLine />

                <styled.AssetInfoTitle>금융</styled.AssetInfoTitle>
                {assets.finance.map((asset, index) =>
                    renderAssetBox(
                        asset.id,
                        `${index + 1}. ${asset.type}`,
                        asset.detail,
                        `${asset.value}원`,
                        inheritanceInfo[asset.id]?.inheritors?.length > 0
                    )
                )}

                <styled.SelectInheriPageLine />

                <styled.AssetInfoTitle>기타</styled.AssetInfoTitle>
                {assets.others.map((asset, index) =>
                    renderAssetBox(
                        asset.id,
                        `${index + 1}. ${asset.type}`,
                        asset.detail,
                        `${asset.value}원`,
                        inheritanceInfo[asset.id]?.inheritors?.length > 0
                    )
                )}
            </>
        );
    };

    return (
        <styled.UploadPageContainer>
            <styled.TopContainer>
                <styled.Title>
                    <span style={{ color: "#4792dc" }}>상속인</span>을 선택해
                    주세요.
                </styled.Title>
                <styled.SubTitle>
                    재산을 어떤 상속인에게 상속할지 설계해보세요.
                </styled.SubTitle>

                <styled.SelectInheriPageContainer>
                    {renderAssets()}
                </styled.SelectInheriPageContainer>

                <InheritorModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedAsset("");
                    }}
                    onSubmit={handleAddInheritor}
                />
            </styled.TopContainer>

            <styled.ButtonBottomDiv>
                <WhiteButton
                    variant="medium"
                    onClick={onPrev}
                    style={{ marginRight: "8px" }}
                >
                    이전으로
                </WhiteButton>
                <BlueButton variant="medium" onClick={onNext}>
                    다음으로
                </BlueButton>
            </styled.ButtonBottomDiv>
        </styled.UploadPageContainer>
    );
};
