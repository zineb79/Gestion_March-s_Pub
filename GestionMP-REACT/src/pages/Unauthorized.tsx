const Unauthorized = () => {
  return (
    <div>
      <h2>Accès refusé 🚫</h2>
      <p>Vous n'avez pas l'autorisation d'accéder à cette page.</p>
      <a href="/login">Retour a la page login</a>
    </div>
  );
};

export default Unauthorized;
