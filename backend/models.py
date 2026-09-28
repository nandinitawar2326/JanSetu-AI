
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from database import Base


class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    department_id = Column(String, unique=True, index=True)
    department_name = Column(String)
    ministry = Column(String)


class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True)
    scheme_id = Column(String, unique=True, index=True)
    scheme_name = Column(String)
    department_id = Column(
        String,
        ForeignKey("departments.department_id")
    )
    category = Column(String)
    target_group = Column(String)


class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    district_id = Column(String, unique=True, index=True)
    district = Column(String)
    state = Column(String)
    population = Column(Integer)
    rural_population = Column(Integer)
    infrastructure_index = Column(Float)


class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    scheme_id = Column(String, index=True)
    district_id = Column(String, index=True)
    year = Column(Integer)

    allocated_budget_lakh = Column(Float)
    released_budget_lakh = Column(Float)
    utilized_budget_lakh = Column(Float)


class Beneficiary(Base):
    __tablename__ = "beneficiaries"

    id = Column(Integer, primary_key=True, index=True)
    scheme_id = Column(String, index=True)
    district_id = Column(String, index=True)
    year = Column(Integer)

    target_beneficiaries = Column(Integer)
    actual_beneficiaries = Column(Integer)


class Outcome(Base):
    __tablename__ = "outcomes"

    id = Column(Integer, primary_key=True, index=True)
    scheme_id = Column(String, index=True)
    district_id = Column(String, index=True)
    year = Column(Integer)

    completion_rate = Column(Float)
    outcome_score = Column(Float)
    satisfaction_score = Column(Float)

