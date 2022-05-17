import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { HelperService } from 'src/app/core/services/helper/helper.service';
import { MenuEventService } from 'src/app/core/services/menu/menu-event.service';
import { ProviderService } from 'src/app/core/services/provider/provider.service';
import { LoginInput } from '../models/input/login-input';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private authService: AuthService,
    private menuEventService: MenuEventService,
    private providerService: ProviderService) { }

  form?: FormGroup;
  isLoading?: boolean;

  ngOnInit(): void {
    this.assignForm();
  }

  sendTempPassword = async () => {
    if (!this.form?.get('email')?.valid) {
      this.providerService.toast.warningMessage('Informe o seu Email!')
      return;
    }

    try {
      this.isLoading = true;
      const result = await this.loginService.sendTempPassword(this.form.get('email')?.value);
      if (!result?.success)
        this.providerService.toast.warningMessage(result?.message ?? 'Ocorreu um erro ao tentar enviar senha temporária!')
      else
        this.providerService.toast.successMessage(result.message ?? 'Senha temporária enviada ao Email informado com sucesso!')
    }
    catch (e) {
      console.error('e => ', e)
      this.providerService.toast.errorMessage('Ocorreu um erro ao tentar enviar senha temporária!')
    }
    finally {
      this.isLoading = false;
    }
  }

  async onSubmit(item: LoginInput): Promise<void> {
    if (!this.form?.valid) {
      this.providerService.toast.warningMessage('Informe os campos corretamente!')
      return;
    }

    try {
      this.isLoading = true;
      item.tempPassword = item.password;
      const result = await this.authService.login(item);
      if (!result?.success)
        this.providerService.toast.warningMessage(result?.message ?? 'Ocorreu um erro ao tentar logar no Intra!')
      else {
        this.menuEventService.changePageMenu(await this.providerService.getSideMenu());

        this.providerService.toast.successMessage('Usuário logado com sucesso!')
        this.providerService.route.navigateByUrl('/home');
      }
    }
    catch (e) {
      console.error('e => ', e)
      this.providerService.toast.errorMessage('Ocorreu um erro ao tentar logar no Intra!')
    }
    finally {
      this.isLoading = false;
    }
  }

  private assignForm = async () => {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(HelperService.emailRegex)]]
    });
  };
}