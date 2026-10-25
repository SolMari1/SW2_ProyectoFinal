import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthUser, JwtPayload, UsuarioPublico, normalizarEmail, toUsuarioPublico } from './auth.mapper';

export const BCRYPT_ROUNDS = 10;

export interface AuthResponse {
  token: string;
  user: UsuarioPublico;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const email = normalizarEmail(dto.email);
    const existente = await this.prisma.usuario.findUnique({ where: { email } });
    if (existente) throw new ConflictException('Ya existe una cuenta con ese email');

    // Los registros públicos siempre son clientes
    const usuario = await this.prisma.usuario.create({
      data: {
        nombre: dto.name.trim(),
        email,
        passwordHash: await bcrypt.hash(dto.password, BCRYPT_ROUNDS),
        rol: 'cliente',
      },
    });
    return this.respuesta(usuario);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const usuario = await this.prisma.usuario.findUnique({ where: { email: normalizarEmail(dto.email) } });
    const valido = usuario ? await bcrypt.compare(dto.password, usuario.passwordHash) : false;
    if (!usuario || !valido) throw new UnauthorizedException('Email o contraseña incorrectos');
    return this.respuesta(usuario);
  }

  async validatePayload(payload: JwtPayload): Promise<AuthUser | null> {
    return this.prisma.usuario.findUnique({
      where: { id: payload.sub },
      select: { id: true, nombre: true, email: true, rol: true },
    });
  }

  private respuesta(usuario: AuthUser): AuthResponse {
    const payload: JwtPayload = { sub: usuario.id, rol: usuario.rol };
    return { token: this.jwt.sign(payload), user: toUsuarioPublico(usuario) };
  }
}
