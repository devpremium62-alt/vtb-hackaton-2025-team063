import {Injectable} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {UserDTO, UserLoginDTO} from "../users/user.dto";
import {JwtService} from "@nestjs/jwt";
import {CodeService} from "../family/code/code.service";

@Injectable()
export class AuthService {
    public constructor(private readonly userService: UsersService, private readonly jwtService: JwtService, private readonly codeService: CodeService) {
    }

    public async register(userDTO: UserDTO) {
        const partner = await this.codeService.getUserFromCode(userDTO.familyCode || "");

        const user = await this.userService.createUser({...userDTO, partner: partner ?? undefined});
        const jwt = this.jwtService.sign({...user});

        return {user, accessToken: jwt};
    }

    public async login(userLoginDTO: UserLoginDTO) {
        const user = await this.userService.getUserByPhone(userLoginDTO);
        const jwt = this.jwtService.sign({...user});

        return {user, accessToken: jwt};
    }
}
