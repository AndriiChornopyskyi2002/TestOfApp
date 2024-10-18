const express = require('express');
const app = express();
const port = 3000;

// Middleware для обробки JSON у запитах
app.use(express.json());

export class Company {
    constructor(id, parentId, employeeCount) {
        this.id = id;
        this.parentId = parentId;
        this.employeeCount = employeeCount;
    }
}

export class CompanyService {
    constructor(companies) {
        this.companies = companies;
    }

    // Знаходить компанію за її id
    findCompanyById(id) {
        return this.companies.find(company => company.id === id);
    }

    // Повертає верхньорівневу компанію
    getTopLevelParent(company) {
        if (!company) {
            return null; // або обробка помилки
        }
        let current = company;
        while (current.parentId !== null) {
            current = this.findCompanyById(current.parentId);
            if (!current) {
                return null; // або обробка помилки
            }
        }
        return current;
    }

    getEmployeeCountForCompanyAndChildren(company) {
        if (!company) {
            return 0; // або обробка помилки
        }
        let totalEmployees = company.employeeCount;
        this.companies
            .filter(c => c.parentId === company.id)
            .forEach(child => {
                totalEmployees += this.getEmployeeCountForCompanyAndChildren(child);
            });
        return totalEmployees;
    }
}

// Ініціалізуємо список компаній
const companies = [
    new Company(1, null, 100),
    new Company(2, 1, 50),
    new Company(3, 1, 30),
    new Company(4, 2, 20),
    new Company(5, 2, 10)
];

// Ініціалізуємо сервіс компанії
const companyService = new CompanyService(companies);

// Маршрут для створення компанії
app.post('/company', (req, res) => {
    const { id, parentId, employeeCount } = req.body;

    // Перевірка на наявність необхідних полів
    if (id === undefined || parentId === undefined || employeeCount === undefined) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    const newCompany = new Company(id, parentId, employeeCount);
    companyService.companies.push(newCompany);
    res.status(201).json(newCompany);
});

// Маршрут для отримання компанії за ID
app.get('/company/:id', (req, res) => {
    const companyId = parseInt(req.params.id);
    const company = companyService.findCompanyById(companyId);
    if (!company) {
        return res.status(404).json({ error: 'Company not found' });
    }
    res.json(company);
});

// Маршрут для оновлення компанії
app.put('/company/:id', (req, res) => {
    const companyId = parseInt(req.params.id);
    const company = companyService.findCompanyById(companyId);
    if (!company) {
        return res.status(404).json({ error: 'Company not found' });
    }
    const { parentId, employeeCount } = req.body;
    company.parentId = parentId !== undefined ? parentId : company.parentId;
    company.employeeCount = employeeCount !== undefined ? employeeCount : company.employeeCount;
    res.json(company);
});

// Маршрут для видалення компанії
app.delete('/company/:id', (req, res) => {
    const companyId = parseInt(req.params.id);
    const index = companyService.companies.findIndex(company => company.id === companyId);
    if (index === -1) {
        return res.status(404).json({ error: 'Company not found' });
    }
    const deletedCompany = companyService.companies.splice(index, 1);
    res.json(deletedCompany);
});

// Маршрут для отримання кількості співробітників компанії
app.get('/company/:id/employee-count', (req, res) => {
    const companyId = parseInt(req.params.id);
    const company = companyService.findCompanyById(companyId);
    if (!company) {
        return res.status(404).json({ error: 'Company not found' });
    }
    const totalEmployees = companyService.getEmployeeCountForCompanyAndChildren(company);
    res.json({ totalEmployees });
});

// Маршрут для отримання кількості дочірніх компаній
app.get('/children-count/:id', (req, res) => {
    const companyId = parseInt(req.params.id);
    const company = companyService.findCompanyById(companyId);

    if (!company) {
        return res.status(404).json({ error: 'Company not found' });
    }

    const childrenCount = companyService.companies.filter(c => c.parentId === companyId).length;
    res.json({ childrenCount });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});