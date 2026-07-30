package DAO.interfaces;
import ifba.gestor_projetos.classes.Aviso;
import java.util.List;

public interface DAOAvisos 
{
    public int inserir(Aviso aviso);
    public List<Aviso> listar(int projeto);    
}
