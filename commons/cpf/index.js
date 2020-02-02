exports.cpfValidator = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, '');

    if (!cpf) {
        return false;
    }

    if (
        cpf === '' ||
        cpf.length < 11 ||
        cpf === '00000000000' ||
        cpf === '11111111111' ||
        cpf === '22222222222' ||
        cpf === '33333333333' ||
        cpf === '44444444444' ||
        cpf === '55555555555' ||
        cpf === '66666666666' ||
        cpf === '77777777777' ||
        cpf === '88888888888' ||
        cpf === '99999999999'
    ) {
        return false;
    }

    let sum = 0;
    let rest;
    const verificator1 = parseInt(cpf.substring(9, 10));
    const verificator2 = parseInt(cpf.substring(10, 11));

    for (let i = 1; i <= 9; i++) {
        const dig = parseInt(cpf.substring(i - 1, i));
        sum = sum + dig * (11 - i);
    }
    
    rest = (sum * 10) % 11;

    if (rest === 10 || rest == 11) {
        rest = 0;
    }

    if (rest !== verificator1) {
        return false;
    }

    sum = 0;

    for (let i = 1; i <= 10; i++) {
        const dig = parseInt(cpf.substring(i - 1, i));
        sum = sum + dig * (12 - i);
    }

    rest = (sum * 10) % 11;

    if (rest === 10 || rest == 11) {
        rest = 0;
    }

    if (rest !== verificator2) {
        return false;
    }

    return true;
};

exports.findCpf = async (cpf, model) => {
    const registers = await model.find({ cpf: cpf }).lean().exec();
    return registers.length;
}