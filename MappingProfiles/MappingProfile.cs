using AutoMapper;
using Uzser.CoreServices.Models.DTO;
using Uzser.CoreServices.Models.Entities;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<SalesHeader, SalesHeaderDto>().ReverseMap().ForMember(dest => dest.Id, opt => opt.Ignore());


        CreateMap<SalesLine, SalesLineDto>().ReverseMap().ForMember(dest => dest.Id, opt => opt.Ignore());



        CreateMap<Stock, LookupItemDto>().ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.STOCK_CODE))
                                          .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.STOCK_NAME));
        CreateMap<Customer, CustomerDto>().ReverseMap();

        CreateMap<Departments, DepartmentsDto>()
            .ForMember(dest => dest.DepartmentCode, opt => opt.MapFrom(src => src.DEPARTMENT_CODE))
            .ForMember(dest => dest.DepartmentName, opt => opt.MapFrom(src => src.DEPARTMENT_NAME));

        CreateMap<Vehicles, VehiclesDto>().ReverseMap().ForMember(dest => dest.Id, opt => opt.Ignore());
        CreateMap<UzserCustomer, UzserCustomerDto>().ReverseMap().ForMember(dest => dest.Id, opt => opt.Ignore());
        CreateMap<Marka, MarkaDto>().ReverseMap().ForMember(dest => dest.Id, opt => opt.Ignore());
        CreateMap<Model, ModelDto>().ReverseMap().ForMember(dest => dest.Id, opt => opt.Ignore());
        CreateMap<OrderSeries, OrderSeriesDto>().ReverseMap().ForMember(dest => dest.Id, opt => opt.Ignore());

        // User Mapping
        CreateMap<UserMapping, UserMappingDto>().ReverseMap().ForMember(dest => dest.Id, opt => opt.Ignore());
        
         CreateMap<Cities, CitiesDto>().ReverseMap().ForMember(dest => dest.LOGICALREF, opt => opt.Ignore());
                                          
    }
}