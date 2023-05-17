
const Domain = 'http://localhost:5199/';

Model.WithDomain(Domain);

function Loaded(Func) {
    document.addEventListener('DOMContentLoaded', Func);
}