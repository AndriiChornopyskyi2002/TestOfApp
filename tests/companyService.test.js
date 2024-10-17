const test = require('node:test');

const { Company, CompanyService } = require('../server'); // Використовуємо require

// Створення тестових даних
const companies = [
    new Company(1, null, 100),
    new Company(2, 1, 50),
    new Company(3, 1, 30),
    new Company(4, 2, 20),
    new Company(5, 2, 10)
];

// Ініціалізуємо сервіс компаній для тестування
const companyService = new CompanyService(companies);

describe('CompanyService', () => {
    test('should return null for null company in getTopLevelParent', () => {
        const result = companyService.getTopLevelParent(null);
        expect(result).toBeNull();
    });

    test('should return 0 for null company in getEmployeeCountForCompanyAndChildren', () => {
        const result = companyService.getEmployeeCountForCompanyAndChildren(null);
        expect(result).toBe(0);
    });

    // 1. Тест пошуку компанії за ID
    test('findCompanyById - Існуюча компанія', () => {
        const company = companyService.findCompanyById(1);
        expect(company).toEqual(companies[0]);
    });

    // 2. Тест пошуку неіснуючої компанії
    test('findCompanyById - Неіснуюча компанія', () => {
        const company = companyService.findCompanyById(99);
        expect(company).toBeUndefined();
    });

    // 3. Тест для перевірки верхньорівневої компанії
    test('getTopLevelParent - компанія рівня 2', () => {
        const company = companyService.findCompanyById(4);
        const topParent = companyService.getTopLevelParent(company);
        expect(topParent.id).toBe(1);
    });

    // 4. Тест, коли компанія вже верхньорівнева
    test('getTopLevelParent - верхньорівнева компанія', () => {
        const company = companyService.findCompanyById(1);
        const topParent = companyService.getTopLevelParent(company);
        expect(topParent.id).toBe(1);
    });

    // 5. Тест на отримання кількості працівників для компанії без дочірніх компаній
    test('getEmployeeCountForCompanyAndChildren - компанія без дочірніх', () => {
        const company = companyService.findCompanyById(5);
        const totalEmployees = companyService.getEmployeeCountForCompanyAndChildren(company);
        expect(totalEmployees).toBe(10);
    });

    // 6. Тест для отримання кількості працівників із дочірніми компаніями
    test('getEmployeeCountForCompanyAndChildren - компанія з дочірніми', () => {
        const company = companyService.findCompanyById(1);
        const totalEmployees = companyService.getEmployeeCountForCompanyAndChildren(company);
        expect(totalEmployees).toBe(210);
    });

    // 7. Тест на отримання кількості працівників компанії, яка не має дочірніх
    test('getEmployeeCountForCompanyAndChildren - компанія без дочірніх', () => {
        const company = companyService.findCompanyById(3);
        const totalEmployees = companyService.getEmployeeCountForCompanyAndChildren(company);
        expect(totalEmployees).toBe(30);
    });

    // 8-20. Додаткові тести
    test('findCompanyById - граничний випадок із null', () => {
        const company = companyService.findCompanyById(null);
        expect(company).toBeUndefined();
    });

    test('getTopLevelParent - null компанія', () => {
        const topParent = companyService.getTopLevelParent(null);
        expect(topParent).toBeNull();
    });

    test('getEmployeeCountForCompanyAndChildren - null компанія', () => {
        const totalEmployees = companyService.getEmployeeCountForCompanyAndChildren(null);
        expect(totalEmployees).toBe(0);
    });

    test('findCompanyById - компанія з від’ємним ID', () => {
        const company = companyService.findCompanyById(-1);
        expect(company).toBeUndefined();
    });

    test('getTopLevelParent - граничний випадок (найменший ID)', () => {
        const company = companyService.findCompanyById(1);
        const topParent = companyService.getTopLevelParent(company);
        expect(topParent.id).toBe(1);
    });

    test('getEmployeeCountForCompanyAndChildren - загальна кількість працівників для компанії з однією дочірньою', () => {
        const company = companyService.findCompanyById(2);
        const totalEmployees = companyService.getEmployeeCountForCompanyAndChildren(company);
        expect(totalEmployees).toBe(80);
    });

    // Тести для випадків, коли структура компаній змінена
    const customCompanies = [
        new Company(1, null, 500),
        new Company(2, 1, 200),
        new Company(3, 2, 50),
        new Company(4, 3, 20)
    ];
    const customService = new CompanyService(customCompanies);

    test('getEmployeeCountForCompanyAndChildren - нестандартна структура компаній', () => {
        const company = customService.findCompanyById(1);
        const totalEmployees = customService.getEmployeeCountForCompanyAndChildren(company);
        expect(totalEmployees).toBe(770);
    });

    // Додати ще кілька тестів, щоб охопити всі можливі випадки
});