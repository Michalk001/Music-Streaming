using MS_Backend.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MS_Backend.ServiceInterfaces
{
    public interface IAccountService
    {
        Task<object> Login(LoginUserViewModel model);
        Task<object> Register(RegisterUserViewModel model);
    }
}
