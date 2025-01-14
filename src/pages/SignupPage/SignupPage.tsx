import React, { useState, ChangeEvent, FormEvent, useMemo } from "react";
import { Link } from "react-router-dom";
import * as styled from "./styles";
import backbtn from "../../images/back-icon.png";
import BlueButton from "../../ui/BlueBtn";
import showPasswordIcon from "../../images/show-pw-icon.png";
import hidePasswordIcon from "../../images/hide-pw-icon.png";

interface FormData {
	phoneNumber: string;
	carrier: string;
	birthDate: string;
	securityCode: string;
	password: string;
	passwordConfirm: string;
	userid: string;
}

type CheckboxKeys = "service" | "financial" | "sms" | "personal" | "benefits";
interface CheckboxState {
	service: boolean;
	financial: boolean;
	sms: boolean;
	personal: boolean;
	benefits: boolean;
}

interface CheckboxProps {
	checked: boolean;
	className?: string;
}

const StepForm = () => {
	const [currentStep, setCurrentStep] = useState<number>(0);
	const [formData, setFormData] = useState<FormData>({
		phoneNumber: "",
		carrier: "",
		birthDate: "",
		securityCode: "",
		password: "",
		passwordConfirm: "",
		userid: "",
	});
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showPasswordConfirm, setShowPasswordConfirm] =
		useState<boolean>(false);
	const [isUserIdChecked, setIsUserIdChecked] = useState<boolean>(false);
	const [isTermsChecked, setIsTermsChecked] = useState<boolean>(false);

	const isStep0Complete = useMemo(() => {
		return formData.phoneNumber.trim() !== "" && formData.carrier !== "";
	}, [formData.phoneNumber, formData.carrier]);

	const isStep1Complete = useMemo(() => {
		const isPasswordValid = formData.password.trim() !== "";
		const isPasswordConfirmValid =
			formData.password === formData.passwordConfirm;
		const isUserIdValid = formData.userid.trim() !== "" && isUserIdChecked;

		return isPasswordValid && isPasswordConfirmValid && isUserIdValid;
	}, [
		formData.password,
		formData.passwordConfirm,
		formData.userid,
		isUserIdChecked,
	]);

	const [checkboxes, setCheckboxes] = useState<CheckboxState>({
		service: false,
		financial: false,
		sms: false,
		personal: false,
		benefits: false,
	});

	const handleInputChange = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (name === "userid") {
			setIsUserIdChecked(false);
		}
	};

	const handleNext = () => {
		if (currentStep === 0 && isStep0Complete) {
			setCurrentStep((prev) => prev + 1);
		} else if (currentStep === 1 && isStep1Complete) {
			setCurrentStep((prev) => prev + 1);
		}
	};

	const handleBack = () => {
		setCurrentStep((prev) => prev - 1);
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		console.log("Login attempt with:", formData);
	};

	const togglePasswordVisibility = (): void => {
		setShowPassword(!showPassword);
	};

	const handleDupCheck = () => {
		//아이디 중복 확인
		setIsUserIdChecked(true);
	};

	const handleSingleCheck = (name: CheckboxKeys) => {
		setCheckboxes((prev) => {
			const newCheckboxes = {
				...prev,
				[name]: !prev[name],
			};

			const allChecked = Object.values(newCheckboxes).every(
				(value) => value
			);
			setIsTermsChecked(allChecked);

			return newCheckboxes;
		});
	};

	const handleAllCheck = () => {
		const newValue = !isTermsChecked;
		setIsTermsChecked(newValue);
		setCheckboxes({
			service: newValue,
			financial: newValue,
			sms: newValue,
			personal: newValue,
			benefits: newValue,
		});
	};

	const areRequiredTermsAccepted = useMemo(() => {
		return (
			checkboxes.service &&
			checkboxes.financial &&
			checkboxes.sms &&
			checkboxes.personal
		);
	}, [checkboxes]);

	// 회원가입 첫번째 화면 - 전화번호 입력
	const renderStep0 = () => (
		<styled.Container>
			<div>
				<Link to="/login" style={{ textDecoration: "none" }}>
					<styled.BackButton src={backbtn} onClick={handleBack} />
				</Link>
				<styled.Title>
					{isStep0Complete
						? "입력한 정보를 확인해주세요"
						: "전화번호를 입력해 주세요."}
				</styled.Title>
				<styled.Form onSubmit={handleSubmit}>
					<styled.Input
						type="tel"
						name="phoneNumber"
						value={formData.phoneNumber}
						onChange={handleInputChange}
						placeholder="01011111111"
					/>
					<styled.Select
						name="carrier"
						value={formData.carrier}
						onChange={handleInputChange}
					>
						<option
							value=""
							disabled
							selected
							style={{ color: "#dadada" }}
						>
							통신사를 선택해주세요
						</option>
						<option value="SKT">SKT</option>
						<option value="KT">KT</option>
						<option value="LGU+">LGU+</option>
						<option value="SKT 알뜰폰">SKT 알뜰폰</option>
						<option value="KT 알뜰폰">KT 알뜰폰</option>
						<option value="LGU+ 알뜰폰">LGU+ 알뜰폰</option>
					</styled.Select>
					<styled.IdNumberDiv>
						<styled.IdNumberFront>990728</styled.IdNumberFront>
						<styled.IdNumberBackDiv>
							<styled.IdNumberBackDivFront>
								2
							</styled.IdNumberBackDivFront>
							<styled.IdNumberBackDivBack>
								******
							</styled.IdNumberBackDivBack>
						</styled.IdNumberBackDiv>
					</styled.IdNumberDiv>
					<styled.NameDiv>홍소희</styled.NameDiv>
				</styled.Form>
			</div>
			<div>
				<BlueButton
					variant="large"
					style={{
						marginBottom: "49px",
						background: isStep0Complete ? "#4792DC" : "#D0D0D0",
					}}
					onClick={handleNext}
				>
					확인
				</BlueButton>
			</div>
		</styled.Container>
	);

	// 회원가입 두번째 화면 - 아이디 비번 입력
	const renderStep1 = () => (
		<styled.Container>
			<div>
				<styled.BackButton src={backbtn} onClick={handleBack} />
				<styled.Title>회원가입</styled.Title>
				<styled.Form onSubmit={handleSubmit}>
					<styled.InputLabel htmlFor="username">
						아이디
					</styled.InputLabel>
					<styled.PasswordInputWrapper>
						<styled.Input
							id="userid"
							name="userid"
							type="text"
							placeholder="아이디를 입력하세요."
							value={formData.userid}
							onChange={handleInputChange}
						/>
						<styled.DupCheckBtn onClick={handleDupCheck}>
							중복확인
						</styled.DupCheckBtn>
					</styled.PasswordInputWrapper>
					<styled.InputLabel htmlFor="password">
						비밀번호
					</styled.InputLabel>
					<styled.PasswordInputWrapper>
						<styled.Input
							id="password"
							name="password"
							type={showPassword ? "text" : "password"}
							placeholder="비밀번호를 입력하세요."
							value={formData.password}
							onChange={handleInputChange}
						/>
						<styled.ShowPasswordIcon
							src={
								showPassword
									? showPasswordIcon
									: hidePasswordIcon
							}
							onClick={togglePasswordVisibility}
							alt={
								showPassword
									? "비밀번호 숨기기"
									: "비밀번호 표시"
							}
						/>
					</styled.PasswordInputWrapper>
					<styled.InputLabel htmlFor="passwordConfirm">
						비밀번호 확인
					</styled.InputLabel>
					<styled.PasswordInputWrapper>
						<styled.Input
							id="passwordConfirm"
							name="passwordConfirm"
							type={showPasswordConfirm ? "text" : "password"}
							placeholder="비밀번호를 입력하세요."
							value={formData.passwordConfirm}
							onChange={handleInputChange}
							style={
								{
									// marginBottom: "0",
								}
							}
						/>
						<styled.ShowPasswordIcon
							src={
								showPasswordConfirm
									? showPasswordIcon
									: hidePasswordIcon
							}
							onClick={() =>
								setShowPasswordConfirm(!showPasswordConfirm)
							}
							alt={
								showPasswordConfirm
									? "비밀번호 숨기기"
									: "비밀번호 표시"
							}
						/>
					</styled.PasswordInputWrapper>
					{formData.passwordConfirm !== "" &&
						formData.password !== formData.passwordConfirm && (
							<styled.ErrorMessage>
								입력하신 비밀번호가 일치하지 않습니다
							</styled.ErrorMessage>
						)}
				</styled.Form>
			</div>
			<div>
				<BlueButton
					variant="large"
					style={{
						marginBottom: "49px",
						background: isStep1Complete ? "#4792DC" : "#D0D0D0",
					}}
					onClick={handleNext}
				>
					확인
				</BlueButton>
			</div>
		</styled.Container>
	);

	// 회원가입 세번째 화면 - 약관 동의
	const renderStep2 = () => (
		<styled.Container>
			<div>
				<styled.BackButton src={backbtn} onClick={handleBack} />
				<styled.Title>약관에 동의해 주세요.</styled.Title>
				<styled.CheckboxAllContainer onClick={handleAllCheck}>
					<styled.Checkbox checked={isTermsChecked} />
					전체 약관에 동의합니다.
				</styled.CheckboxAllContainer>
				<styled.CheckboxContainer
					onClick={() => handleSingleCheck("service")}
				>
					<styled.Checkbox checked={checkboxes.service} />
					서비스 이용 약관
				</styled.CheckboxContainer>
				<styled.CheckboxContainer
					onClick={() => handleSingleCheck("financial")}
				>
					<styled.Checkbox checked={checkboxes.financial} />
					전자금융거래 이용 약관
				</styled.CheckboxContainer>
				<styled.CheckboxContainer
					onClick={() => handleSingleCheck("sms")}
				>
					<styled.Checkbox checked={checkboxes.sms} />
					SMS 인증 약관
				</styled.CheckboxContainer>
				<styled.CheckboxContainer
					onClick={() => handleSingleCheck("personal")}
				>
					<styled.Checkbox checked={checkboxes.personal} />
					개인(신용)정보 관련 이용 약관
				</styled.CheckboxContainer>
				<styled.CheckboxContainer
					onClick={() => handleSingleCheck("benefits")}
				>
					<styled.Checkbox checked={checkboxes.benefits} />
					혜택 정보 수신 동의(선택)
				</styled.CheckboxContainer>
			</div>
			<div>
				<BlueButton
					variant="large"
					style={{
						marginBottom: "49px",
						background: areRequiredTermsAccepted
							? "#4792DC"
							: "#D0D0D0",
					}}
					onClick={handleNext}
				>
					확인
				</BlueButton>
			</div>
		</styled.Container>
	);

	const steps = [renderStep0, renderStep1, renderStep2];

	return <styled.Container>{steps[currentStep]()}</styled.Container>;
};

export default StepForm;
