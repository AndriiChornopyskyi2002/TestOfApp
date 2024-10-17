const express = require('express');
const app = express();
const port = 3000;

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

// Маршрут для отримання верхньорівневої компанії
app.get('/top-level-parent/:id', (req, res) => {
    const companyId = parseInt(req.params.id);
    const company = companyService.findCompanyById(companyId);

    if (!company) {
        return res.status(404).json({ error: 'Company not found' });
    }

    const topLevelParent = companyService.getTopLevelParent(company);
    res.json(topLevelParent);
});

// Маршрут для отримання кількості співробітників
app.get('/employee-count/:id', (req, res) => {
    const companyId = parseInt(req.params.id);
    const company = companyService.findCompanyById(companyId);

    if (!company) {
        return res.status(404).json({ error: 'Company not found' });
    }

    const totalEmployees = companyService.getEmployeeCountForCompanyAndChildren(company);
    res.json({ totalEmployees });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});