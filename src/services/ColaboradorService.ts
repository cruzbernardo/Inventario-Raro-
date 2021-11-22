import { IColaboradorRepository } from "../@types/repositories/IColaboradorRepository";
import { IColaboradorService } from "../@types/services/IColaboradorService";
import { Inject, Service } from "typedi";
import { Colaborador } from "../models/ColaboradorEntity";
import {
  AlterarColaboradorDto,
  ColaboradorTratado,
  CriarColaboradorDto,
} from "../@types/dto/ColaboradorDto";
import { colaboradorFactory } from "../dataMappers/colaboradorFactory";
import { ColaboradorNaoExiste } from "../@types/errors/ColaboradorNaoExiste";
import { RetornoEnderecoCriadoDto } from "../@types/dto/EnderecoDto";
import { Endereco } from "../models/EnderecoEntity";

@Service("ColaboradorService")
export class ColaboradorService implements IColaboradorService {
  constructor(
    @Inject("ColaboradorRepository")
    private colaboradorRepository: IColaboradorRepository
  ) {}
  async listar(): Promise<ColaboradorTratado[]> {
    const colaboradores = await this.colaboradorRepository.findAll();
    const colaboradoresTratados = colaboradores.map((colaborador) => {
      return this.removeIds(colaborador);
    });
    return colaboradoresTratados;
  }
  async buscar(colaboradorId: number): Promise<ColaboradorTratado> {
    const colaborador = await this.checaColaborador(colaboradorId);
    const colaboradorTratado = this.removeIds(colaborador);
    return colaboradorTratado;
  }
  async criar(
    colaboradorDto: CriarColaboradorDto
  ): Promise<ColaboradorTratado> {
    const novoColaborador = colaboradorFactory(colaboradorDto);
    await this.colaboradorRepository.save(novoColaborador);
    const colaboradorTratado = this.removeIds(novoColaborador);
    return colaboradorTratado;
  }
  async atualizar(
    id: number,
    colaboradorDtoAtualizado: AlterarColaboradorDto
  ): Promise<ColaboradorTratado> {
    const colaborador = await this.checaColaborador(id);
    const colaboradorAtualizado = this.atualizaColaborador(
      colaborador,
      colaboradorDtoAtualizado
    );
    const colaboradorSalvo = await this.colaboradorRepository.save(
      colaboradorAtualizado
    );
    return this.removeIds(colaboradorSalvo);
  }
  async remover(id: number): Promise<void> {
    const colaboradorPraRemover = await this.checaColaborador(id);
    await this.colaboradorRepository.remove(colaboradorPraRemover);
    return;
  }

  private async checaColaborador(id: number): Promise<Colaborador> {
    const colaborador = await this.colaboradorRepository.findById(id);
    if (!colaborador) {
      throw new ColaboradorNaoExiste();
    }
    return colaborador;
  }

  private removeIds(colaborador: Colaborador): ColaboradorTratado {
    const { id, endereco, equipamentos, movimentacoes, ...colaboradorTratado } =
      colaborador;
    const novoColaborador: ColaboradorTratado = {
      ...colaboradorTratado,
      ...{ endereco: this.removeEnderecoId(endereco) },
    };
    return novoColaborador;
  }

  private removeEnderecoId(endereco: Endereco): RetornoEnderecoCriadoDto {
    const { id, ...enderecoTratado } = endereco;
    return enderecoTratado;
  }
  private atualizaColaborador(
    colaborador: Colaborador,
    colaboradorAlterado: AlterarColaboradorDto
  ): Colaborador {
    const { email, endereco, nome, telefone, dataInicio } = {
      ...colaboradorAlterado,
    };
    if (dataInicio) {
      colaborador.dataInicio = new Date(dataInicio);
    }
    colaborador.endereco = { ...colaborador.endereco, ...endereco };

    const novasPropriedades = { email, nome, telefone };
    const colaboradorAtualizado = { ...colaborador, ...novasPropriedades };

    return colaboradorAtualizado;
  }
}
