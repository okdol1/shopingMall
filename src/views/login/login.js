import * as Api from '/api.js';
import { validateEmail } from '/useful-functions.js';

// 요소(element), input 혹은 상수
const emailInput = document.querySelector('#emailInput');
const passwordInput = document.querySelector('#passwordInput');
const submitButton = document.querySelector('#submitButton');
const navBar = document.querySelector('#navbar')

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
	registerBtn()
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
	submitButton.addEventListener('click', handleSubmit);
}

function registerBtn() {
	const liTag = document.createElement('li');
	const aTag = document.createElement('a');
	aTag.href = `/register${location.search}`;
	aTag.textContent = '회원가입';
	liTag.append(aTag);
	navBar.prepend(liTag);
}
// 로그인 진행
async function handleSubmit(e) {
	e.preventDefault();

	const email = emailInput.value;
	const password = passwordInput.value;

	// 잘 입력했는지 확인
	const isEmailValid = validateEmail(email);
	const isPasswordValid = password.length >= 4;

	if (!isEmailValid || !isPasswordValid) {
		return swal(
			'비밀번호가 4글자 이상인지, 이메일 형태가 맞는지 확인해 주세요.',
		);
	}

	// 로그인 api 요청
	try {
		const data = { email, password };

		const result = await Api.post('/api/login', data);
		const token = result.token;

		// 로그인 성공, 토큰을 세션 스토리지에 저장
		// 물론 다른 스토리지여도 됨
		localStorage.setItem('token', token);

		swal(`정상적으로 로그인되었습니다.`).then(() => {
			const encodeURI = location.search
			const URI = decodeURIComponent(encodeURI)
			const searchURI = new URLSearchParams(URI)
			const beforeURI = searchURI.get('beforeURI')
			if(beforeURI){
				location.href = beforeURI;
			}else{
				swal('비정상적인 접근입니다.')
			}
		});
	} catch (err) {
		console.error(err.stack);
		swal(err.message);
	}
}
