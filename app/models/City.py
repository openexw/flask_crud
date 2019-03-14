from sqlalchemy import Column, Integer

from app.models.Base import Base


class City(Base):
    id = Column(Integer, primary_key=True)
    # name

