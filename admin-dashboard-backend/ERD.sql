CREATE TABLE Admin (
    AdminID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(100) NOT NULL
);

-- Inserting dummy data into Admin
INSERT INTO Admin (Name, Email, Password)
VALUES
('admin', 'm.kashif2452000@gmail.com.com', 'admin'),
('kashif', 'm.kashi613@gmail.com', 'kashif');

CREATE TABLE Investor (
    InvestorID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    DateOfBirth DATE NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(100) NOT NULL,
    Account VARCHAR(20) CHECK (Account IN ('Active', 'Inactive', 'Suspended')) NOT NULL
);

INSERT INTO Investor (Name, DateOfBirth, Email, Password, Account)
VALUES
('John Doe', '1980-05-15', 'john.doe@example.com', 'password789', 'Active'),
('Jane Doe', '1990-07-22', 'jane.doe@example.com', 'password101', 'Inactive');

CREATE TABLE Project (
    ProjectID SERIAL PRIMARY KEY,
    AdminID INT REFERENCES Admin(AdminID),
    Title VARCHAR(200) NOT NULL,
    Description TEXT,
    TargetAmount DECIMAL(15, 2) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL
);

INSERT INTO Project (AdminID, Title, Description, TargetAmount, StartDate, EndDate)
VALUES
(1, 'Solar Energy Project', 'A project to build a solar farm.', 500000.00, '2024-01-01', '2024-12-31'),
(2, 'Tech Innovation Hub', 'A hub for fostering tech startups.', 750000.00, '2024-03-01', '2024-11-30');


CREATE TABLE Investment (
    InvestmentID SERIAL PRIMARY KEY,
    InvestorID INT REFERENCES Investor(InvestorID),
    ProjectID INT REFERENCES Project(ProjectID),
    Amount DECIMAL(15, 2) NOT NULL,
    InvestedDate DATE NOT NULL,
    ProfitOrLoss DECIMAL(10, 2) NOT NULL
);

INSERT INTO Investment (InvestorID, ProjectID, Amount, InvestedDate, ProfitOrLoss)
VALUES
(1, 1, 10000.00, '2024-02-15', 500.00),
(2, 2, 20000.00, '2024-04-10', -1000.00);

SELECT * from Admin
SELECT * FROM Investor
SELECT * FROM Project
SELECT * from Investment