package DAO.classes;

import DAO.interfaces.DAOAvisos;
import DAO.interfaces.DAOComponente;
import DAO.interfaces.DAOProjetos;

public abstract class DAOFactory {
    public static DAOProjetos criarDAOProjetos() {
        return new DAOProjetosJDBC();
    }
    
    public static DAOComponente criarDAOComponente() {
        return new DAOComponenteJDBC();
    }
    
    public static DAOAvisos criarDAOAvisos() {
        return new DAOAvisosJDBC();
    }
}
