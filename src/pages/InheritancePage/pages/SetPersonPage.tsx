import React, { useState } from "react";
import { PageProps } from "../types";
import * as styled from "../UploadPhotoPage/styles";
import BlueButton from "../../../ui/BlueBtn";
import WhiteButton from "../../../ui/WhiteBtn";
import { Executor } from "../../../services/dto/Will";
import { message } from "antd";

const SetPersonPage: React.FC<PageProps> = ({
    onNext,
    onPrev,
    formData,
    setFormData,
}): JSX.Element => {
    const [executors, setExecutors] = useState<Executor[]|[]>(
        formData.executors == null ? [{ name: "", relation: "", phoneNumber: "", priority: 1 }]
        : formData.executors.length > 0 ? formData.executors
            : [{ name: "", relation: "", phoneNumber: "", priority: 1 }]
    );

    const updateFormData = (newExecutors: Executor[]) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            executors: newExecutors,
        }));
    };

    const handleNameChange = (index: number, value: string) => {
        const newExecutors = [...executors];
        newExecutors[index].name = value;
        setExecutors(newExecutors);
        updateFormData(newExecutors);
    };

    const handleRelationshipChange = (index: number, value: string) => {
        const newExecutors = [...executors];
        newExecutors[index].relation = value;
        setExecutors(newExecutors);
        updateFormData(newExecutors);
    };

    const handlePhoneNumberChange = (index: number, value: string) => {
        // 숫자만 추출
        const numbers = value.replace(/[^0-9]/g, '');
        
        // 11자리로 제한
        const limitedNumbers = numbers.slice(0, 11);
        
        // 000-0000-0000 형식으로 포맷팅
        let formattedNumber = '';
        if (limitedNumbers.length <= 3) {
            formattedNumber = limitedNumbers;
        } else if (limitedNumbers.length <= 7) {
            formattedNumber = `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3)}`;
        } else {
            formattedNumber = `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3, 7)}-${limitedNumbers.slice(7)}`;
        }
        
        const newExecutors = [...executors];
        newExecutors[index].phoneNumber = formattedNumber;
        setExecutors(newExecutors);
        updateFormData(newExecutors);
    };

    const handleMoveUp = (index: number) => {
        if (index === 0) return; // 첫 번째 항목이면 이동 불가
        const newExecutors = [...executors];
        [newExecutors[index], newExecutors[index - 1]] = [
            newExecutors[index - 1],
            newExecutors[index],
        ];
        // 우선순위 재정렬
        const updatedExecutors = newExecutors.map((executor, i) => ({
            ...executor,
            priority: i + 1,
        }));
        setExecutors(updatedExecutors);
        updateFormData(updatedExecutors);
    };

    const handleMoveDown = (index: number) => {
        if (index === executors.length - 1) return; // 마지막 항목이면 이동 불가
        const newExecutors = [...executors];
        [newExecutors[index], newExecutors[index + 1]] = [
            newExecutors[index + 1],
            newExecutors[index],
        ];
        // 우선순위 재정렬
        const updatedExecutors = newExecutors.map((executor, i) => ({
            ...executor,
            priority: i + 1,
        }));
        setExecutors(updatedExecutors);
        updateFormData(updatedExecutors);
    };

    const handleAddExecutor = (prevPriority: number) => {
        const newExecutors = [
            ...executors,
            { name: "", relation: "", phoneNumber: "", priority: prevPriority + 1 },
        ];
        setExecutors(newExecutors);
        updateFormData(newExecutors);
    };

    const handleRemoveExecutor = () => {
        if (executors.length > 1) {
            const newExecutors = executors.slice(0, -1); // 마지막 항목 삭제
            setExecutors(newExecutors);
            updateFormData(newExecutors);
        } else {
            message.error("첫 번째 항목은 삭제할 수 없습니다.");
        }
    };

    return (
        <styled.UploadPageContainer>
            <styled.TopContainer>
                <styled.Title>
                    3. <span style={{ color: "#4792dc" }}>유언집행자</span>를
                    지정해주세요.
                </styled.Title>
                <styled.SubTitle>
                    유언 내용을 집행하기 위한 동기 이전, 예금 인출 동의 <br />
                    사무처리에 대한 업무 권한을 가지는 사람을 지정해주세요.
                </styled.SubTitle>

                <styled.InheritorPageContainer>
                    {executors != null && executors.map((executor, index) => (
                        <styled.InheritorPageSection key={index}>
                            {/* 성함 */}
                            <styled.Page6InputDiv
                                style={{
                                    marginTop: index === 0 ? "0" : "50px",
                                }}
                            >
                                <styled.Page6InputDivText>
                                    성함 :{" "}
                                </styled.Page6InputDivText>
                                <styled.Page6Input
                                    value={executor.name}
                                    onChange={(e) =>
                                        handleNameChange(index, e.target.value)
                                    }
                                    style={{
                                        padding: "0 10px",
                                        fontSize: "14px",
                                    }}
                                />
                            </styled.Page6InputDiv>
                            {/* 관계 */}
                            <styled.Page6InputDiv style={{ marginTop: "10px" }}>
                                <styled.Page6InputDivText>
                                    관계 :{" "}
                                </styled.Page6InputDivText>
                                <styled.Page6Select
                                    value={executor.relation}
                                    onChange={(e) =>
                                        handleRelationshipChange(
                                            index,
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="" disabled>
                                        관계를 선택해 주세요.
                                    </option>
                                    <option value="spouse">배우자</option>
                                    <option value="parents">부모</option>
                                    <option value="children">자녀</option>
                                    <option value="legalHeirs">
                                        법정상속인
                                    </option>
                                    <option value="donation">
                                        국가 등에 기부(유증)
                                    </option>
                                </styled.Page6Select>
                            </styled.Page6InputDiv>
                            {/* 전화번호 */}
                            <styled.Page6InputDiv style={{ marginTop: "10px" }}>
                                <styled.Page6InputDivText>
                                    전화번호 :{" "}
                                </styled.Page6InputDivText>
                                <styled.Page6Input
                                    value={executor.phoneNumber}
                                    onChange={(e) =>
                                        handlePhoneNumberChange(index, e.target.value)
                                    }
                                    placeholder="숫자만 입력하세요"
                                />
                            </styled.Page6InputDiv>
                            {/* 우선순위 */}
                            <styled.Page6InputDiv style={{ marginTop: "10px" }}>
                                <styled.Page6InputDivText>
                                    우선순위: {index + 1}
                                </styled.Page6InputDivText>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "5px",
                                        fontSize: "12px",
                                        marginLeft: "25px",
                                    }}
                                >
                                    <BlueButton
                                        variant="small"
                                        onClick={() => handleMoveUp(index)}
                                        disabled={index === 0}
                                    >
                                        위로
                                    </BlueButton>
                                    <BlueButton
                                        variant="small"
                                        onClick={() => handleMoveDown(index)}
                                        disabled={
                                            index === executors.length - 1
                                        }
                                    >
                                        아래로
                                    </BlueButton>
                                </div>
                            </styled.Page6InputDiv>
                        </styled.InheritorPageSection>
                    ))}
                    <styled.ButtonSection>
                        <BlueButton
                            variant="small"
                            style={{
                                fontWeight: "500",
                                fontSize: "11px",
                                marginTop: "8px",
                                marginBottom: "60px",
                                marginRight: "5px",
                                outline: "none",
                            }}
                            onClick={() => handleAddExecutor(executors.length)}
                        >
                            추가하기
                        </BlueButton>
                        <WhiteButton
                            variant="small"
                            style={{
                                background: "lightgray",
                                color: "white",
                                fontWeight: "500",
                                fontSize: "11px",
                                marginTop: "8px",
                                marginBottom: "60px",
                                marginRight: "15px",
                                outline: "none",
                            }}
                            onClick={handleRemoveExecutor}
                        >
                            삭제하기
                        </WhiteButton>
                    </styled.ButtonSection>
                </styled.InheritorPageContainer>
            </styled.TopContainer>
            <styled.ButtonBottomDiv>
                <WhiteButton
                    variant="medium"
                    onClick={() => {
                        console.log("Page 6 - Going back:", formData.executors);
                        onPrev();
                    }}
                    style={{ marginRight: "8px" }}
                >
                    이전으로
                </WhiteButton>
                <BlueButton
                    variant="medium"
                    onClick={() => {
                        console.log("Page 6 - Moving forward:", formData.executors);
                        onNext();
                    }}
                >
                    다음으로
                </BlueButton>
            </styled.ButtonBottomDiv>
        </styled.UploadPageContainer>
    );
};

export default SetPersonPage;