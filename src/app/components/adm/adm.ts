import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginUserDto } from '../../model/LoginUserDto';
import { AuthService } from '../../service/auth-service';
import { RouterLink } from '@angular/router';
import { AdmService } from '../../service/adm-service';
import { VisualizarEmpDTO } from '../../model/VisualizarEmpDTO';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


@Component({
    selector: 'app-adm',
    standalone: true,
    imports: [RouterLink, ReactiveFormsModule, CommonModule, FormsModule],
    templateUrl: './adm.html',
    styleUrl: './adm.css'
})
export class Adm implements OnInit {
    emprestimos: VisualizarEmpDTO[] = [];
    emprestimosAtrasados: VisualizarEmpDTO[] = [];
    mostrarTabelaEmprestimos = false;
    mostrarTabelaEmprestimosAtrasado = false;


    constructor(private authService: AuthService, private admService: AdmService) { }

    ngOnInit() {
        this.carregarEmprestimos();
    }

    exibirTabelaAtrasado() {
        this.mostrarTabelaEmprestimos = false;
        this.mostrarTabelaEmprestimosAtrasado = true;
    }

    exibirTabela() {
        this.mostrarTabelaEmprestimos = true;
        this.mostrarTabelaEmprestimosAtrasado = false;
    }



    async carregarEmprestimos() {
        try {
            const dados = await this.admService.todosEmprestimos();
            this.emprestimos = dados;
        } catch (error) {
            console.error('Erro ao carregar empréstimos:', error);
        }
    }

    async carregarEmprestimosAtrasados() {
        try {
            const dados = await this.admService.todosEmprestimosAtrasados();
            this.emprestimosAtrasados = dados;
            console.log('Emprestimos atrasados carregados: ', this.emprestimosAtrasados);
        } catch (error) {
            console.log('Erro ao carregar emprestimos atrasados!', error);
        }
    }

    devolverLivro(livro: any) {
        if (confirm(`Tem certeza que deseja marcar "${livro.titulo}" como devolvido?`)) {

            const emprestimos = JSON.parse(
                localStorage.getItem('emprestimos') || '[]'
            );
            const emprestimosAtualizados = emprestimos.filter((emp: any) => emp.id !== livro.id);
            localStorage.setItem('emprestimos', JSON.stringify(emprestimosAtualizados));

            this.carregarEmprestimos();
            alert('Livro marcado como devolvido!');
        }
    }

    deletarEmprestimo(livro: any) {
        if (confirm(`Tem certeza que deseja EXCLUIR o empréstimo de "${livro.titulo}"? Esta ação não pode ser desfeita.`)) {
            const emprestimos = JSON.parse(localStorage.getItem('emprestimos') || '[]');
            const emprestimosAtualizados = emprestimos.filter((emp: any) => emp.id !== livro.id);
            localStorage.setItem('emprestimos', JSON.stringify(emprestimosAtualizados));

            this.carregarEmprestimos();
            alert('Empréstimo excluído!');
        }
    }


    async exportarDados() {
        const lista = await this.admService.todosEmprestimos();
        this.emprestimos = lista;

        // Convertendo JSON para planilha
        const worksheet = XLSX.utils.json_to_sheet(this.emprestimos);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Empréstimos");

        // Gerando o arquivo Excel
        const excelBuffer: any = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });

        // Baixando arquivo
        const blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        saveAs(blob, `emprestimos_${new Date().toISOString().split('T')[0]}.xlsx`);
    }


    logout() { this.authService.logout(); }
} 