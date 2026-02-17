using EidSystem.API.Data;
using EidSystem.API.Models.DTOs.Requests;
using EidSystem.API.Models.DTOs.Responses;
using EidSystem.API.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EidSystem.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AreasController : ControllerBase
{
    private readonly AppDbContext _context;

    public AreasController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<AreaResponse>>>> GetAll()
    {
        var areas = await _context.Areas.Where(a => a.IsActive).OrderBy(a => a.SortOrder).ToListAsync();
        var result = areas.Select(a => new AreaResponse
        {
            AreaId = a.AreaId,
            NameAr = a.NameAr,
            NameEn = a.NameEn,
            DeliveryCost = a.DeliveryCost,
            IsActive = a.IsActive,
            SortOrder = a.SortOrder
        });
        return Ok(ApiResponse<IEnumerable<AreaResponse>>.SuccessResponse(result));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<AreaResponse>>> GetById(int id)
    {
        var area = await _context.Areas.FindAsync(id);
        if (area == null)
            return NotFound(ApiResponse<AreaResponse>.ErrorResponse("المنطقة غير موجودة"));

        return Ok(ApiResponse<AreaResponse>.SuccessResponse(new AreaResponse
        {
            AreaId = area.AreaId,
            NameAr = area.NameAr,
            NameEn = area.NameEn,
            DeliveryCost = area.DeliveryCost,
            IsActive = area.IsActive,
            SortOrder = area.SortOrder
        }));
    }

    [Authorize(Roles = "admin")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<AreaResponse>>> Create([FromBody] CreateAreaRequest request)
    {
        var area = new Area
        {
            NameAr = request.NameAr,
            NameEn = request.NameEn,
            DeliveryCost = request.DeliveryCost,
            SortOrder = request.SortOrder,
            IsActive = true
        };

        _context.Areas.Add(area);
        await _context.SaveChangesAsync();
        
        return Ok(ApiResponse<AreaResponse>.SuccessResponse(new AreaResponse
        {
            AreaId = area.AreaId,
            NameAr = area.NameAr,
            NameEn = area.NameEn,
            DeliveryCost = area.DeliveryCost,
            IsActive = area.IsActive,
            SortOrder = area.SortOrder
        }, "تم إنشاء المنطقة بنجاح"));
    }

    [Authorize(Roles = "admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<AreaResponse>>> Update(int id, [FromBody] UpdateAreaRequest request)
    {
        var area = await _context.Areas.FindAsync(id);
        if (area == null)
            return NotFound(ApiResponse<AreaResponse>.ErrorResponse("المنطقة غير موجودة"));

        area.NameAr = request.NameAr;
        area.NameEn = request.NameEn;
        area.DeliveryCost = request.DeliveryCost;
        area.SortOrder = request.SortOrder;
        area.IsActive = request.IsActive;

        await _context.SaveChangesAsync();

        return Ok(ApiResponse<AreaResponse>.SuccessResponse(new AreaResponse
        {
            AreaId = area.AreaId,
            NameAr = area.NameAr,
            NameEn = area.NameEn,
            DeliveryCost = area.DeliveryCost,
            IsActive = area.IsActive,
            SortOrder = area.SortOrder
        }, "تم تحديث المنطقة بنجاح"));
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
    {
        var area = await _context.Areas.FindAsync(id);
        if (area == null)
            return NotFound(ApiResponse<object>.ErrorResponse("المنطقة غير موجودة"));

        area.IsActive = false; // Soft delete
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null!, "تم حذف المنطقة بنجاح"));
    }
}
