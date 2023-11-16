/**
 * 验证表单
 * @param self vue传来的this
 * @param data.key 要验证的字段,例如phone,name,email等
 * @param data.value  输入的值,要验证的值
 * @param data.title 字段显示的名称 例如电话/邮箱/地址等等
 * @param data.maxlength 长度超过最大限度
 * @param data.minlength 长度不得小于
 * @param data.text_transform 默认不验证大小写
 * @param data.space 默认不验证空格忽略空格
 * @returns {string|boolean}
 */
export const validateForm =( data) => {
    let key = data['key'] || ''
    let value = data.value || ''
    let title = data.title || ''
    let _maxlength = data._maxlength || ''
    let _minlength = data._minlength || ''

    let _text_transform = data.text_transform || false
    let _space = data.space || false
    if (!value) {
        return `${title} Cannot be empty`
    }
    !_text_transform ? value = value.toLowerCase() : ''
    !_space ? value = value.replace(/\s*/g, '') : ''
    switch (key) {
        case 'type':
        case 'rate':
        case 'title_type':
            break
        case 'company_tel' :
        case 'receiver_phone' :
        case 'phone' :
        case 'tel':
            if (!/^1\d{10}$/.test(value)) {
                return `${title}Incorrect format`
            }
            break
        case 'amount':
            if (value * 1 === 0) {
                return `${title} Cannot be 0`
            }
            break
        case 'password':
            let reg = /^[a-zA-Z0-9~!@#$%^&*()_+`\-={}:";'<>?,.\/]{6,15}$/
            if (!reg.test(value)) {
                return 'Incorrect password format'
            }
            break
        case 'email' :
        case 'e_mail' :
        case 'mail' :
            if (value.indexOf("@") === -1 || value.indexOf(".") === -1) {
                return `${title} Incorrect format`;
            }
            // var emailReg = /^[a-zA-Z0-9]+([-_.][A-Za-zd]+)*@([a-zA-Z0-9]+[-.])+[A-Za-zd]{2,5}$/
            // if (!emailReg.test(value)) {
            //     return `${title} Incorrect format`
            // }
            break
        case 'id-card' :
        case 'idCard' :
        case 'id_card' :
            var idCard = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/
            if (!idCard.test(value)) {
                return `${title} Incorrect format`
            }
            break
        case 'company_tax_no' : // 公司税号
            var company_tax_no = /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/g
            let _val = value.toUpperCase()
            if (!company_tax_no.test(_val)) {
                return `${title} Incorrect format!`
            }
            break
        case 'bank_no' : // 开户行账号
            var bank_no = /^[1-9]\d{3,29}$/g
            if (!bank_no.test(value)) {
                return `${title} Incorrect format`
            }
            break
        default: //
            var _default = /^\d{2,}$/
            if (value.length < 2) {
                return `${title} Incorrect format`
            }
            break
    }
    // 无正则时验证长度
    if (_maxlength && value.length >= _maxlength) {
        return `${title} Length exceeds maximum limit, maximum length ${_maxlength} Characters`
    } else if (_minlength && value.length <= _minlength) {
        return `${title} The length must not be less than ${_minlength} Characters`
    }
}
