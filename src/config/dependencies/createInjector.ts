import { getCustomRepository } from "typeorm";
import Container from "typedi";
import { UsuarioRepository } from "../../repositories/UsuarioRepository";
import { ColaboradorRepository } from "../../repositories/ColaboradorRepository";
import { EquipamentoRepository } from "../../repositories/EquipamentoRepository";
import { TipoEquipamentoRepository } from "../../repositories/TipoEquipamentoRepository";
import { ParametroRepository } from "../../repositories/ParametroRepository";

// inicializador de dependências:
// inicializa controllers
import "../../controllers/UserController";
import "../../controllers/EnderecoController";
import "../../controllers/ColaboradorController";

// inicializa services
import "../../services/UsuarioService";
import "../../services/EnderecoService";
import "../../services/ColaboradorService";
import "../../services/EquipamentoService";
import "../../services/TipoEquipamentoService";
import "../../services/ParametroService";

// inicializa clientes
import "../../clients/CepClient";
import "../../infra/http/AxiosHttpClient";

const createDependencyInjector = (): void => {
  Container.set("UsuarioRepository", getCustomRepository(UsuarioRepository));
  Container.set(
    "ColaboradorRepository",
    getCustomRepository(ColaboradorRepository)
  );
  Container.set(
    "EquipamentoRepository",
    getCustomRepository(EquipamentoRepository)
  );
  Container.set(
    "TipoEquipamentoRepository",
    getCustomRepository(TipoEquipamentoRepository)
  );
  Container.set(
    "ParametroRepository",
    getCustomRepository(ParametroRepository)
  );
};

export default createDependencyInjector;
