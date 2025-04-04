using AutoMapper;
using BerAuto.DataContext.Dtos;
using BerAuto.DataContext.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BerAuto.Services
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<UserCreateDto, User>();
            CreateMap<UserUpdateDto, User>();

            CreateMap<Address, AddressDto>().ReverseMap();
            CreateMap<AddressCreateDto, Address>();

            CreateMap<Role, RoleDto>().ReverseMap();
            CreateMap<RoleCreateDto, Role>();
            CreateMap<RoleUpdateDto, Role>();

            CreateMap<CarCategory, CarCategoryDto>().ReverseMap();
            CreateMap<CarCategoryCreateDto, CarCategory>();
            CreateMap<CarCategoryUpdateDto, CarCategory>();

            CreateMap<Car, CarDto>().ReverseMap();
            CreateMap<Car, CarCreateDto>().ReverseMap();
            CreateMap<CarUpdateDto, Car>();

            CreateMap<Rent, RentDto>().ReverseMap();
            CreateMap<Rent, RentCreateDto>().ReverseMap();
            //CreateMap<RentUpdateDto, Rent>();
        }
    }
}
