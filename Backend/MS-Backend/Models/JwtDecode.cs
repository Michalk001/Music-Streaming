using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;

namespace MS_Backend.Models
{
    public static class JwtDecode
    {
        public static string User(string token)
        {

            var jwtEncodedString = token.Replace("Bearer ", string.Empty); 

            var decodeToken = new JwtSecurityToken(jwtEncodedString: jwtEncodedString);
            var userName = decodeToken.Claims.Where(x => x.Type == "sub").FirstOrDefault().Value;
            return userName;
        }
    }
}
