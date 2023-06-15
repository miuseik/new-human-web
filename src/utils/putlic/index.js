export  const debounce = (fn, delay) => {
		let timer = null;
		return function () {
				let context = this;
				let args = arguments;
				clearTimeout(timer);
				timer = setTimeout(function () {
						fn.apply(context, args);
				}, delay);
		};
};
export default debounce;

//封装节流
//新建文件后将以下代码放入
export  const throttle = (fn, delay) => {
		let valid = true;
		return function () {
				let context = this;
				let args = arguments;
				if (!valid) {
						return false;
				}
				valid = false;
				setTimeout(() => {
						fn.apply(context, args);
						valid = true;
				}, delay);
		};
};

