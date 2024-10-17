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

// Для нестандартної структури компаній
const customCompanies = [
    new Company(1, null, 500),
    new Company(2, 1, 200),
    new Company(3, 2, 50),
    new Company(4, 3, 20)
];
const customService = new CompanyService(customCompanies);

describe('CompanyService', () => {
    // 1. Тест пошуку компанії за ID
    test('findCompanyById - Існуюча компанія', async () => {
        const company = await companyService.findCompanyById(1);
        expect(company).toEqual(companies[0]);
    });

    // 2. Тест пошуку неіснуючої компанії
    test('findCompanyById - Неіснуюча компанія', async () => {
        const company = await companyService.findCompanyById(99);
        expect(company).toBeUndefined();
    });

    // 3. Тест для перевірки верхньорівневої компанії
    test('getTopLevelParent - компанія рівня 2', async () => {
        const company = await companyService.findCompanyById(4);
        const topParent = companyService.getTopLevelParent(company);
        expect(topParent.id).toBe(1);
    });

    // 4. Тест, коли компанія вже верхньорівнева
    test('getTopLevelParent - верхньорівнева компанія', async () => {
        const company = await companyService.findCompanyById(1);
        const topParent = companyService.getTopLevelParent(company);
        expect(topParent.id).toBe(1);
    });

    // 5. Тест на отримання кількості працівників для компанії без дочірніх компаній
    test('getEmployeeCountForCompanyAndChildren - компанія без дочірніх', async () => {
        const company = await companyService.findCompanyById(5);
        const totalEmployees = companyService.getEmployeeCountForCompanyAndChildren(company);
        expect(totalEmployees).toBe(10);
    });

    // 6. Тест для отримання кількості працівників із дочірніми компаніями
    test('getEmployeeCountForCompanyAndChildren - компанія з дочірніми', async () => {
        const company = await companyService.findCompanyById(1);
        const totalEmployees = companyService.getEmployeeCountForCompanyAndChildren(company);
        expect(totalEmployees).toBe(210);
    });

    // 7. Тест на отримання кількості працівників компанії, яка не має дочірніх
    test('getEmployeeCountForCompanyAndChildren - компанія без дочірніх', async () => {
        const company = await companyService.findCompanyById(3);
        const totalEmployees = companyService.getEmployeeCountForCompanyAndChildren(company);
        expect(totalEmployees).toBe(30);
    });

    // 8. Граничний випадок: пошук компанії з null ID
    test('findCompanyById - граничний випадок із null', async () => {
        const company = await companyService.findCompanyById(null);
        expect(company).toBeUndefined();
    });

    // 9. Тест: getTopLevelParent для null компанії
    test('getTopLevelParent - null компанія', () => {
        const topParent = companyService.getTopLevelParent(null);
        expect(topParent).toBeNull();
    });

    // 10. Тест: отримати кількість працівників для null компанії
    test('getEmployeeCountForCompanyAndChildren - null компанія', () => {
        const totalEmployees = companyService.getEmployeeCountForCompanyAndChildren(null);
        expect(totalEmployees).toBe(0);
    });

    // 11. Тест: пошук компанії з від’ємним ID
    test('findCompanyById - компанія з від’ємним ID', async () => {
        const company = await companyService.findCompanyById(-1);
        expect(company).toBeUndefined();
    });

    // 12. Тест: верхній рівень для компанії з ID = 1
    test('getTopLevelParent - граничний випадок (найменший ID)', async () => {
        const company = await companyService.findCompanyById(1);
        const topParent = companyService.getTopLevelParent(company);
        expect(topParent.id).toBe(1);
    });

    // 13. Тест: загальна кількість працівників для компанії з однією дочірньою
    test('getEmployeeCountForCompanyAndChildren - загальна кількість працівників для компанії з однією дочірньою', async () => {
        const company = await companyService.findCompanyById(2);
        const totalEmployees = companyService.getEmployeeCountForCompanyAndChildren(company);
        expect(totalEmployees).toBe(80);
    });

    // 14. Тест: нестандартна структура компаній
    test('getEmployeeCountForCompanyAndChildren - нестандартна структура компаній', async () => {
        const company = await customService.findCompanyById(1);
        const totalEmployees = customService.getEmployeeCountForCompanyAndChildren(company);
        expect(totalEmployees).toBe(770);
    });

    // 15. Тест: перевірка на 0 працівників у верхньорівневій компанії
    test('getEmployeeCountForCompanyAndChildren - компанія з нульовою кількістю працівників', async () => {
        const company = new Company(6, null, 0);
        const totalEmployees = companyService.getEmployeeCountForCompanyAndChildren(company);
        expect(totalEmployees).toBe(0);
    });

    // 16. Тест: перевірка на верхньорівневу компанію без дочірніх
    test('getEmployeeCountForCompanyAndChildren - верхньорівнева компанія без дочірніх', async () => {
        const company = await companyService.findCompanyById(3);
        const totalEmployees = companyService.getEmployeeCountForCompanyAndChildren(company);
        expect(totalEmployees).toBe(30);
    });

    // 17. Тест: перевірка структури компаній з декількома дочірніми
    test('getEmployeeCountForCompanyAndChildren - компанія з декількома дочірніми', async () => {
        const company = await companyService.findCompanyById(2);
        const totalEmployees = companyService.getEmployeeCountForCompanyAndChildren(company);
        expect(totalEmployees).toBe(80);
    });

    // 18. Тест: верхній рівень для компанії з ID 3
    test('getTopLevelParent - компанія з ID 3', async () => {
        const company = await companyService.findCompanyById(3);
        const topParent = companyService.getTopLevelParent(company);
        expect(topParent.id).toBe(1);
    });

    // 19. Тест: перевірка повернення дочірніх компаній
    test('getEmployeeCountForCompanyAndChildren - перевірка дочірніх компаній', async () => {
        const company = await companyService.findCompanyById(1);
        const childrenCount = company.children.length;
        expect(childrenCount).toBe(2); // Очікуємо 2 дочірні компанії
    });

    // 20. Тест: перевірка на компанії з однаковим числом працівників
    test('getEmployeeCountForCompanyAndChildren - компанії з однаковою кількістю працівників', async () => {
        const company1 = await companyService.findCompanyById(2);
        const company2 = await companyService.findCompanyById(4);
        const totalEmployees1 = companyService.getEmployeeCountForCompanyAndChildren(company1);
        const totalEmployees2 = companyService.getEmployeeCountForCompanyAndChildren(company2);
        expect(totalEmployees1).not.toEqual(totalEmployees2);
    });
});